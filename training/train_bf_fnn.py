import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import numpy as np
from models.bf_fnn import BFFNN

scores = np.load("results/anomaly_scores.npy")

threshold = np.percentile(scores, 90)
labels = (scores > threshold).astype(int)

X = scores.reshape(-1,1)
y = labels

model = BFFNN()
model.train(X, y)

print("✅ BF-FNN trained and saved")
