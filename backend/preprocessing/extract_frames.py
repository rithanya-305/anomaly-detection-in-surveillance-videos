import cv2
import os

def extract_frames(video_path, output_dir):
    os.makedirs(output_dir, exist_ok=True)

    cap = cv2.VideoCapture(video_path)
    count = 0

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        frame_path = os.path.join(output_dir, f"{count:05d}.jpg")
        cv2.imwrite(frame_path, frame)
        count += 1

    cap.release()
    print(f"[OK] Extracted {count} frames")

if __name__ == "__main__":
    extract_frames(
        "data/raw_videos/test.mp4",
        "data/frames/Train/video1"
    )
