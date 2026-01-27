📹 Anomaly Detection in Surveillance Videos

This project detects abnormal activities in surveillance videos using deep learning.
It supports both offline video analysis and live camera anomaly detection.

The system uses a multi-stage ML pipeline:
Autoencoder → MLP-RNN → BF-FNN → Final anomaly decision

🎯 Project Objective

Detect unusual events in CCTV / surveillance footage

Learn normal behavior using unsupervised learning

Highlight abnormal frames in output video

Support real-time camera detection

Provide a base for UI + alert system

🧠 Methodology (Pipeline)
Input Video
   ↓
Frame Extraction
   ↓
Autoencoder (reconstruction error)
   ↓
Anomaly Scores
   ↓
MLP-RNN (temporal modeling)
   ↓
Refined Scores
   ↓
BF-FNN (final decision)
   ↓
Annotated Output Video / Live Detection

📊 Models Used
1️⃣ Autoencoder (Implemented)

Learns normal patterns from video frames

High reconstruction error = anomaly

Used for primary anomaly scoring

2️⃣ MLP-RNN (Implemented)

Models temporal behavior of scores

Learns motion consistency over time

Reduces false positives

3️⃣ Bayesian Feed Forward Neural Network (BF-FNN) (Implemented)

Refines anomaly confidence

Produces final anomaly decision

Used for stable detection

🗂️ Project Structure
anomaly_detection_project/
│
├── backend/
│   └── inference/
│       ├── detect.py
│       ├── advanced_detect.py
│       └── predict_video.py
│
├── models/
│   ├── autoencoder.py
│   ├── mlp_rnn.py
│   ├── bf_fnn.py
│   └── *.pth / *.pkl
│
├── training/
│   ├── train_autoencoder.py
│   ├── train_mlp_rnn.py
│   ├── train_bf_fnn.py
│   └── rnn_dataset.py
│
├── data/
│   └── input_videos/
│
├── results/
│   ├── anomaly_scores.npy
│   └── output_videos/
│
├── preprocessing/
├── utils/
├── ui/ (planned)
└── README.md

📁 Dataset Used

UCSD Pedestrian Dataset (Ped1 / Ped2)

Unlabeled (unsupervised learning)

Real CCTV-style videos

Not uploaded due to size constraints

⚙️ Tools & Technologies

Python

PyTorch (Deep Learning)

OpenCV (Video processing)

NumPy

Matplotlib

FastAPI (UI – planned)

Git & GitHub

VS Code

✅ Current Features (Completed)

✔ Video preprocessing
✔ Autoencoder training
✔ Anomaly score generation
✔ MLP-RNN training
✔ BF-FNN training
✔ Offline video detection
✔ Output video with anomaly marking
✔ Live laptop camera detection
✔ GitHub project structure

🧪 Results

Generated 7056 anomaly scores

Abnormal frames detected and marked

Output video saved to:

results/output_videos/anomaly_output.avi


Live camera works in real time

📅 Project Status
Day 1

Project setup

Folder structure

Dataset understanding

Autoencoder implemented

Day 2

MLP-RNN implemented and trained

BF-FNN implemented and trained

Offline video anomaly detection completed

Live camera anomaly detection completed

Output video generation

GitHub updated

🚀 Next Steps (Day 3)

Build UI using FastAPI

Real-time anomaly dashboard

Live alerts

Threshold tuning

Performance optimization

YouTube demo recording

🎥 Demo (Coming Soon)

YouTube demo link will be added after UI integration.

## Day 3 Progress (23-01-2026)

- Fixed environment issues and reinstalled VS Code
- Activated venv and reinstalled dependencies
- Live camera anomaly detection tested successfully
- MLP-RNN and BF-FNN training verified
- Git conflicts resolved and repo cleaned
- Ready to build UI (FastAPI based)


