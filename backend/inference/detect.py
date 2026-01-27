import os
import cv2
import numpy as np

# ===============================
# SETTINGS
# ===============================
VIDEO_PATH = "data/input_videos/test.mp4"
SCORES_PATH = "results/anomaly_scores.npy"
OUTPUT_DIR = "results/output_videos"
OUTPUT_VIDEO = "anomaly_output.avi"

CLIP_LEN = 16
FPS = 25
THRESHOLD = 0.00005
  # adjust if needed

# ===============================
# PREP
# ===============================
os.makedirs(OUTPUT_DIR, exist_ok=True)
output_path = os.path.join(OUTPUT_DIR, OUTPUT_VIDEO)

scores = np.load(SCORES_PATH)
print("Loaded anomaly scores:", scores.shape)

cap = cv2.VideoCapture(VIDEO_PATH)
if not cap.isOpened():
    raise RuntimeError("❌ Cannot open video")

width  = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
fps    = cap.get(cv2.CAP_PROP_FPS) or FPS

writer = cv2.VideoWriter(
    output_path,
    cv2.VideoWriter_fourcc(*"XVID"),
    fps,
    (width, height)
)

# ===============================
# FIND ABNORMAL FRAMES
# ===============================
abnormal_frames = set()
for i, s in enumerate(scores):
    if s > THRESHOLD:
        start = i * CLIP_LEN
        for f in range(start, start + CLIP_LEN):
            abnormal_frames.add(f)

print("Total abnormal frames:", len(abnormal_frames))

# ===============================
# WRITE OUTPUT VIDEO
# ===============================
frame_id = 0

while True:
    ret, frame = cap.read()
    if not ret:
        break

    if frame_id in abnormal_frames:
        # 🔴 draw red border
        cv2.rectangle(frame, (0, 0), (width-1, height-1), (0, 0, 255), 8)

        # 🔴 text
        cv2.putText(
            frame,
            "ANOMALY DETECTED",
            (30, 50),
            cv2.FONT_HERSHEY_SIMPLEX,
            1.2,
            (0, 0, 255),
            3
        )

    writer.write(frame)
    frame_id += 1

cap.release()
writer.release()

print("✅ Output video saved to:", output_path)
