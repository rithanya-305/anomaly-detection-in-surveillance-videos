import sys, os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

import cv2
import numpy as np
import torch
import joblib

from models.autoencoder import AutoEncoder
from models.mlp_rnn import MLP_RNN

# ----------------------------
# Load Models
# ----------------------------
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Autoencoder
autoencoder = AutoEncoder().to(device)
autoencoder.load_state_dict(torch.load("models/autoencoder.pth", map_location=device))
autoencoder.eval()

# MLP-RNN
mlp_rnn = MLP_RNN().to(device)
mlp_rnn.load_state_dict(torch.load("models/mlp_rnn.pth", map_location=device))
mlp_rnn.eval()

# BF-FNN
bf_fnn = joblib.load("models/bf_fnn.pkl")

# ----------------------------
# Parameters
# ----------------------------
SEQ_LEN = 16
THRESHOLD = 0.7
score_buffer = []

# ----------------------------
# Open Laptop Camera
# ----------------------------
cap = cv2.VideoCapture(0, cv2.CAP_DSHOW)

if not cap.isOpened():
    print("❌ Camera not opening")
    exit()

print("🎥 Live camera started (press Q to quit)")

# ----------------------------
# Live Detection Loop
# ----------------------------
while True:
    ret, frame = cap.read()
    if not ret:
        break

    # ----------------------------
    # Preprocessing (RGB - FIXED)
    # ----------------------------
    frame_resized = cv2.resize(frame, (128, 128))
    frame_norm = frame_resized / 255.0

    # Convert to tensor: (1, 3, 128, 128)
    x = torch.tensor(frame_norm).permute(2, 0, 1).unsqueeze(0).float().to(device)

    # ----------------------------
    # Autoencoder anomaly score
    # ----------------------------
    with torch.no_grad():
        recon = autoencoder(x)
        score = torch.mean((recon - x) ** 2).item()

    score_buffer.append(score)

    # ----------------------------
    # Temporal refinement (MLP-RNN)
    # ----------------------------
    if len(score_buffer) >= SEQ_LEN:
        seq = np.array(score_buffer[-SEQ_LEN:]).reshape(1, SEQ_LEN, 1)
        seq_tensor = torch.tensor(seq, dtype=torch.float32).to(device)

        with torch.no_grad():
            refined_score = mlp_rnn(seq_tensor).item()

        # ----------------------------
        # Final decision (BF-FNN)
        # ----------------------------
        prob = bf_fnn.predict_proba([[refined_score]])[0][1]

        if prob > THRESHOLD:
            cv2.putText(
                frame,
                "🚨 ANOMALY DETECTED",
                (20, 50),
                cv2.FONT_HERSHEY_SIMPLEX,
                1,
                (0, 0, 255),
                2
            )

    # Show live output
    cv2.imshow("Advanced Live Anomaly Detection", frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# ----------------------------
# Cleanup
# ----------------------------
cap.release()
cv2.destroyAllWindows()
