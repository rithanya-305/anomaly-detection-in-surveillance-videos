import os
import numpy as np
import torch
from torch.utils.data import Dataset

class ClipDataset(Dataset):
    def __init__(self, root):
        self.files = []
        for folder in os.listdir(root):
            path = os.path.join(root, folder)
            if os.path.isdir(path):
                for f in os.listdir(path):
                    if f.endswith(".npy"):
                        self.files.append(os.path.join(path, f))

    def __len__(self):
        return len(self.files)

    def __getitem__(self, idx):
        clip = np.load(self.files[idx])          # (T, H, W, C)
        frame = clip[0]                           # take 1st frame
        frame = frame.astype("float32") / 255.0
        frame = np.transpose(frame, (2, 0, 1))    # (C, H, W)
        return torch.tensor(frame)
