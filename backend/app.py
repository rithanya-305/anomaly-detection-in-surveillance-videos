import os
import sys
import subprocess
import base64
import numpy as np
import cv2
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# -------------------------------------------------
# PATH CONFIGURATION (UPLOAD MODE ONLY)
# -------------------------------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_FOLDER = os.path.join(BASE_DIR, "data", "input_videos")
RESULTS_FOLDER = os.path.join(BASE_DIR, "results")

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(RESULTS_FOLDER, exist_ok=True)

# -------------------------------------------------
# BASIC ROUTES
# -------------------------------------------------
@app.route("/")
def home():
    return jsonify({"message": "Anomaly Detection Backend is running"})


@app.route("/health")
def health():
    return jsonify({"status": "ok"})


# -------------------------------------------------
# LIVE CAMERA DETECTION ROUTE (NO FILE STORAGE)
# -------------------------------------------------
@app.route("/live_detect", methods=["POST"])
def live_detect():
    data = request.json

    if data is None or "frame" not in data:
        return jsonify({"error": "No frame received"}), 400

    try:
        # Decode base64 frame
        img_bytes = base64.b64decode(data["frame"])
        np_arr = np.frombuffer(img_bytes, np.uint8)
        frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

        if frame is None:
            return jsonify({"error": "Invalid frame"}), 400

        # Simple real-time anomaly logic (CPU safe)
        motion_score = float(np.std(frame))
        is_anomaly = motion_score > 50
        confidence = min(motion_score / 100, 1.0)

        return jsonify({
            "isAnomaly": bool(is_anomaly),
            "confidence": round(confidence, 2)
        })

    except Exception as e:
        return jsonify({
            "error": "Live detection failed",
            "details": str(e)
        }), 500


# -------------------------------------------------
# UPLOAD + VIDEO INFERENCE ROUTE
# -------------------------------------------------
@app.route("/upload", methods=["POST"])
def upload_video():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]

    if file.filename == "":
        return jsonify({"error": "Empty filename"}), 400

    # Save uploaded video
    video_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(video_path)

    try:
        # Step 1: generate anomaly scores
        subprocess.run(
            [sys.executable, "-m", "inference.anomaly_score", video_path],
            cwd=BASE_DIR,
            check=True
        )

        # Step 2: generate abnormal frames
        subprocess.run(
            [sys.executable, "-m", "inference.predict_video", video_path],
            cwd=BASE_DIR,
            check=True
        )

        # Load results if they exist
        abnormal_path = os.path.join(RESULTS_FOLDER, "abnormal_frames.npy")
        scores_path = os.path.join(RESULTS_FOLDER, "anomaly_scores.npy")

        abnormal_count = 0
        max_score = 0.0

        if os.path.exists(abnormal_path):
            abnormal_count = int(len(np.load(abnormal_path)))

        if os.path.exists(scores_path):
            scores = np.load(scores_path)
            if len(scores) > 0:
                max_score = float(scores.max())

        is_anomaly = abnormal_count > 50
        confidence = min(max_score / 0.001, 1.0) if max_score > 0 else 0.0

        return jsonify({
            "message": "Upload & anomaly detection successful",
            "fileName": file.filename,
            "isAnomaly": bool(is_anomaly),
            "anomalyType": "Suspicious Activity" if is_anomaly else None,
            "confidence": round(confidence, 2),
            "abnormalFrames": abnormal_count
        })

    except subprocess.CalledProcessError as e:
        return jsonify({
            "error": "Inference failed",
            "details": str(e)
        }), 500


# -------------------------------------------------
# MAIN
# -------------------------------------------------
if __name__ == "__main__":
    print("Backend started")
    app.run(host="0.0.0.0", port=5000, debug=True)
