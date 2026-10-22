# Transcreve (faster-whisper, no seu PC, sem API) os vídeos do estudo que ainda não têm transcricao.txt.
# Com placa NVIDIA usa a GPU (uns 15 s por vídeo); sem ela, a CPU com um modelo menor (bem mais lento).
# O laço abaixo acha as DLLs do CUDA que o pip instala e que o Windows não acha sozinho.
# Opcional: a análise funciona sem transcrição (usa a imagem e o texto do anúncio).
# Uso: python -I 1-estudo-de-mercado/scripts/transcrever.py <slug>
import os, sys, pathlib, site, subprocess
for sp in site.getsitepackages():
    for sub in ("cuda_runtime", "cublas", "cudnn", "cuda_nvrtc"):
        d = pathlib.Path(sp) / "nvidia" / sub / "bin"
        if d.is_dir():
            os.environ["PATH"] = str(d) + os.pathsep + os.environ["PATH"]
            os.add_dll_directory(str(d))
from faster_whisper import WhisperModel
estudo = pathlib.Path(__file__).resolve().parent.parent / "estudos" / sys.argv[1]
midia = estudo / "midia"
try:
    m = WhisperModel("medium", device="cuda", compute_type="float16")
except Exception:
    print("Sem GPU NVIDIA: usando a CPU com o modelo small (mais lento).", flush=True)
    m = WhisperModel("small", device="cpu", compute_type="int8")
ids = (estudo / "estudo-ids.txt").read_text().split()
feitos = 0
for i in ids:
    d = midia / i
    v = next((d / n for n in ("video-1.mp4", "peca-1.mp4") if (d / n).exists()), None)
    t = d / "transcricao.txt"
    if not v or t.exists():
        continue
    audio = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "a", "-show_entries", "stream=index", "-of", "csv=p=0", str(v)], capture_output=True, text=True).stdout.strip()
    if not audio:
        t.write_text("(vídeo sem faixa de áudio)", encoding="utf-8"); continue
    segs, info = m.transcribe(str(v), language="pt", vad_filter=True)
    linhas = [f"[{s.start:05.1f}s] {s.text.strip()}" for s in segs]
    t.write_text("\n".join(linhas) or "(sem fala)", encoding="utf-8")
    feitos += 1
    print(i, f"{info.duration:.0f}s", len(linhas), "trechos", flush=True)
print("FIM", feitos, "transcritos")
