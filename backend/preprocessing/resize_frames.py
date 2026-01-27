import os
import cv2

INPUT_DIR = "data/frames"
OUTPUT_SIZE = (224, 224)

for split in ["Train", "Test"]:
    split_path = os.path.join(INPUT_DIR, split)
    for folder in os.listdir(split_path):
        folder_path = os.path.join(split_path, folder)
        if not os.path.isdir(folder_path):
            continue

        for img in os.listdir(folder_path):
            img_path = os.path.join(folder_path, img)

            image = cv2.imread(img_path)
            if image is None:
                continue

            resized = cv2.resize(image, OUTPUT_SIZE)
            cv2.imwrite(img_path, resized)

print("✅ All frames resized to 224x224")
