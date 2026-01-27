import sys
import os
sys.path.append(os.path.abspath("."))

import torch
import numpy as np
from torch.utils.data import DataLoader
from models.autoencoder import AutoEncoder


print("🚀 Starting anomaly scoring...")

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Load model
model = AutoEncoder().to(device)
model.load_state_dict(torch.load("models/autoencoder.pth", map_location=device))
model.eval()
print("✅ Model loaded")

# Load test clips
CLIP_DIR = "data/clips/test"
clip_files = []

for root, dirs, files in os.walk(CLIP_DIR):
    for f in files:
        if f.endswith(".npy"):
            clip_files.append(os.path.join(root, f))

print(f"📂 Found {len(clip_files)} test clips")

scores = []

with torch.no_grad():
    for file in clip_files:
        clip = np.load(file)
        clip = torch.tensor(clip, dtype=torch.float32) / 255.0

        clip = clip[0]                    # take first frame
        clip = clip.permute(2, 0, 1)       # HWC → CHW
        clip = clip.unsqueeze(0).to(device)

        recon = model(clip)
        loss = torch.mean((recon - clip) ** 2).item()
        scores.append(loss)

# Save results
os.makedirs("results", exist_ok=True)
np.save("results/anomaly_scores.npy", np.array(scores))

print("💾 Saved anomaly scores to results/anomaly_scores.npy")
print("🎉 Done")
