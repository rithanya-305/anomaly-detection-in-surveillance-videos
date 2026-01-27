import numpy as np
import torch
from torch.utils.data import Dataset

class ScoreSequenceDataset(Dataset):
    def __init__(self, score_file, seq_len=16):
        scores = np.load(score_file)

        self.sequences = []
        for i in range(len(scores) - seq_len):
            seq = scores[i:i+seq_len]
            self.sequences.append(seq)

        self.sequences = np.array(self.sequences)

    def __len__(self):
        return len(self.sequences)

    def __getitem__(self, idx):
        x = self.sequences[idx].reshape(-1, 1)
        y = x[-1]   # predict next anomaly score
        return torch.tensor(x, dtype=torch.float32), torch.tensor(y, dtype=torch.float32)
