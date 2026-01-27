import os
import cv2
import numpy as np

FRAMES_DIR = "data/frames"
OUT_DIR = "data/clips"
CLIP_LEN = 16

def create_clips(split):
    in_split = os.path.join(FRAMES_DIR, split)
    out_split = os.path.join(OUT_DIR, split)
    os.makedirs(out_split, exist_ok=True)

    for folder in os.listdir(in_split):
        folder_path = os.path.join(in_split, folder)
        if not os.path.isdir(folder_path):
            continue

        frames = sorted([f for f in os.listdir(folder_path) if f.endswith(".tif")])
        clips_folder = os.path.join(out_split, folder)
        os.makedirs(clips_folder, exist_ok=True)

        for i in range(0, len(frames) - CLIP_LEN, CLIP_LEN):
            clip = []
            for j in range(CLIP_LEN):
                img = cv2.imread(os.path.join(folder_path, frames[i + j]))
                img = cv2.resize(img, (224, 224))
                clip.append(img)

            clip = np.array(clip)
            np.save(os.path.join(clips_folder, f"clip_{i}.npy"), clip)

        print(f"✅ Clips created for {split}/{folder}")

if __name__ == "__main__":
    create_clips("Train")
    create_clips("Test")
