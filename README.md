📹 Anomaly Detection in Surveillance Videos

This project detects abnormal activities in surveillance videos using deep learning.
It supports both video analysis and live camera anomaly detection.

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
anomaly-detection-project/
│
├── backend/
│ └── inference/
│ ├── detect.py
│ ├── advanced_detect.py
│ └── predict_video.py
│
├── models/
│ ├── autoencoder.py
│ ├── mlp_rnn.py
│ ├── bf_fnn.py
│ └── trained_models (*.pth / *.pkl)
│
├── training/
│ ├── train_autoencoder.py
│ ├── train_mlp_rnn.py
│ ├── train_bf_fnn.py
│ └── rnn_dataset.py
│
├── data/
│ └── input_videos/
│
├── results/
│ ├── anomaly_scores.npy
│ └── output_videos/
│
├── preprocessing/
├── utils/
├── frontend/ # Web UI (React – implemented)
├── config/
├── requirements.txt
├── .gitignore
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

## 🛠️ How to Run the Project Locally

### 1️⃣ Clone the Repository

git clone https://github.com/rithanya-305/anomaly-detection-in-surveillance-videos.git
cd anomaly-detection-in-surveillance-videos

🎓 Use Cases
*Smart surveillance systems
*Campus & traffic monitoring
*Video anomaly detection research
*Academic AI/ML projects

## 📈 Development Progress & Timeline

This project was developed iteratively over multiple days, covering model design, backend inference, real-time detection, and frontend UI integration.

---

### 📅 Day 1 — Project Setup & Planning
✅ Completed Tasks
- Finalized project topic: Anomaly Detection in Surveillance Videos
- Defined problem scope (offline analysis + real-time detection)
- Selected dataset: UCSD Pedestrian Dataset (Ped1 / Ped2)
- Designed overall system architecture
- Initialized GitHub repository
- Set up Python environment and dependencies
- Created base folder structure

---

### 📅 Day 2 — Core Anomaly Detection Pipeline
✅ Completed Tasks
- Implemented video preprocessing pipeline:
  - Frame extraction
  - Frame resizing and normalization
- Generated clips for motion-based analysis
- Trained Autoencoder for unsupervised anomaly detection
- Generated anomaly scores using reconstruction error
- Visualized anomaly scores using plots
- Implemented video-level anomaly detection
- Generated output video with anomaly overlay
- Completed backend inference pipeline
- Finalized backend folder structure

🧠 Models Used
- Autoencoder (reconstruction-based anomaly detection)
- MLP-RNN (temporal modeling – prepared)
- BF-FNN (score refinement – prepared)

📊 Results
- Generated **7056 anomaly scores**
- Abnormal frames detected and highlighted
- Output video saved to:
<<<<<<< HEAD
=======


---

### 📅 Day 3 — Real-Time Detection & UI Foundation
✅ Completed Tasks
- Integrated live laptop camera input
- Verified real-time anomaly detection
- Designed web-based UI layout
- Created dashboard for upload & results
- Implemented upload page for surveillance videos
- Integrated basic navigation and branding
- Prepared frontend structure for backend API integration

🎨 UI Stack
- React + Vite
- TypeScript
- Tailwind CSS
- ShadCN UI

---

### 📅 Day 4 — Backend–Frontend Integration
✅ Completed Tasks
- Exposed backend inference endpoints (API)
- Connected frontend video upload with backend
- Implemented request/response handling
- Enabled backend-triggered ML inference from UI
- Displayed processing status in UI
- Verified video upload → inference flow

---

### 📅 Day 5 — Result Visualization & System Stabilization
✅ Completed Tasks
- Displayed anomaly detection results in UI dashboard
- Added video playback for output videos
- Improved anomaly marking visibility
- Refined backend error handling
- Improved inference stability and logging
- Cleaned and standardized project structure

---

### 📅 Day 6 — Testing, Optimization & Documentation
✅ Completed Tasks
- Tested system on multiple video inputs
- Verified offline and real-time detection flows
- Optimized preprocessing and inference pipeline
- Reduced false positives in anomaly detection
- Added detailed README documentation
- Updated project run instructions
- Organized Git commits and repository history

---

### 📅 Day 7 — Finalization & Deployment Readiness
✅ Completed Tasks
- End-to-end system verification:

👩‍💻 Author

Rithanya Ramasamy
B.E. Computer Engineering
AI / ML | Full-Stack Developer

GitHub: https://github.com/rithanya-305
>>>>>>> ee9b46b857cf1bcefa319ceafecaa3f632170d51


---

### 📅 Day 3 — Real-Time Detection & UI Foundation
✅ Completed Tasks
- Integrated live laptop camera input
- Verified real-time anomaly detection
- Designed web-based UI layout
- Created dashboard for upload & results
- Implemented upload page for surveillance videos
- Integrated basic navigation and branding
- Prepared frontend structure for backend API integration

🎨 UI Stack
- React + Vite
- TypeScript
- Tailwind CSS
- ShadCN UI

---

### 📅 Day 4 — Backend–Frontend Integration
✅ Completed Tasks
- Exposed backend inference endpoints (API)
- Connected frontend video upload with backend
- Implemented request/response handling
- Enabled backend-triggered ML inference from UI
- Displayed processing status in UI
- Verified video upload → inference flow

---

### 📅 Day 5 — Result Visualization & System Stabilization
✅ Completed Tasks
- Displayed anomaly detection results in UI dashboard
- Added video playback for output videos
- Improved anomaly marking visibility
- Refined backend error handling
- Improved inference stability and logging
- Cleaned and standardized project structure

---

### 📅 Day 6 — Testing, Optimization & Documentation
✅ Completed Tasks
- Tested system on multiple video inputs
- Verified offline and real-time detection flows
- Optimized preprocessing and inference pipeline
- Reduced false positives in anomaly detection
- Added detailed README documentation
- Updated project run instructions
- Organized Git commits and repository history

---

### 📅 Day 7 — Finalization & Deployment Readiness
✅ Completed Tasks
- End-to-end system verification:

👩‍💻 Author

Rithanya Ramasamy
B.E. Computer Engineering
AI / ML | Full-Stack Developer

GitHub: https://github.com/rithanya-305

