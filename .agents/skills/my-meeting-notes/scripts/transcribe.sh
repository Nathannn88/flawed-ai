#!/usr/bin/env bash
# 会议录音 → GPU 转写。用法: bash transcribe.sh <录音路径> [model] [输出目录]
# 默认 model=medium，输出目录=录音所在目录。产出 <原名>_audio.mp3 与 <原名>_audio.txt。
set -euo pipefail

IN="${1:?用法: transcribe.sh <录音路径> [model] [输出目录]}"
MODEL="${2:-medium}"
OUTDIR="${3:-$(dirname "$IN")}"
BASE="$(basename "${IN%.*}")"
AUDIO="$OUTDIR/${BASE}_audio.mp3"

# ── GPU 自检（本机 RTX 5090，禁止退回 CPU）──
GPU=$(python -c "import torch; print(torch.cuda.is_available())" 2>/dev/null || echo "False")
if [ "$GPU" != "True" ]; then
  echo "!! GPU 不可用 (torch.cuda.is_available()=False)。"
  echo "!! 多半装了纯 CPU 版 torch。先执行："
  echo "!!   python -m pip install --upgrade torch --index-url https://download.pytorch.org/whl/cu128"
  echo "!! 装好再重跑本脚本。禁止退回 CPU 转写。"
  exit 1
fi

echo ">> 抽音频: $AUDIO"
ffmpeg -y -i "$IN" -vn -ac 1 -ar 16000 -c:a libmp3lame -q:a 4 "$AUDIO"

echo ">> GPU 转写 (model=$MODEL, device=cuda)"
whisper "$AUDIO" --model "$MODEL" --language Chinese --device cuda --fp16 True \
  --output_format txt --output_dir "$OUTDIR" --verbose False

echo ">> 完成: $OUTDIR/${BASE}_audio.txt"
