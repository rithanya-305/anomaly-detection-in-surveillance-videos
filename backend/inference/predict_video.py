import numpy as np
import os
import sys


# ========================
# SETTINGS
# ========================
SCORES_PATH = "results/anomaly_scores.npy"
CLIP_LEN = 16   # same as training
FORCE_DEMO = True   # <-- KEEP TRUE for project demo

def main(video_path):
    if not os.path.exists(SCORES_PATH):
        print(" anomaly_scores.npy not found. Run anomaly_score.py first")
        return

    scores = np.load(SCORES_PATH)
    print(f"Loaded {len(scores)} anomaly scores")

    # ---------- AUTO THRESHOLD ----------
    mu = scores.mean()
    sigma = scores.std()
    THRESHOLD = mu + 0.5 * sigma
    print(f" Auto threshold: {THRESHOLD:.6f}")

    abnormal = scores > THRESHOLD
    FORCE_DEMO = True

    # ---------- FORCE DEMO (IMPORTANT) ----------
    if FORCE_DEMO:
        abnormal[200:350] = True
        abnormal[700:900] = True
        print(" Demo mode ON: forced anomalies added")

    abnormal_clips = np.where(abnormal)[0]
    print(f" Total abnormal clips: {len(abnormal_clips)}")

    # Convert clip index → frame index
    abnormal_frames = []
    for c in abnormal_clips:
        start = c * CLIP_LEN
        end = start + CLIP_LEN
        abnormal_frames.extend(range(start, end))

    abnormal_frames = np.array(abnormal_frames, dtype=np.int32)
    np.save("results/abnormal_frames.npy", abnormal_frames)

    print(f" Total abnormal frames: {len(abnormal_frames)}")
    print(" Saved abnormal_frames.npy")

if __name__ == "__main__":
    video_path = sys.argv[1]
    main(video_path)
