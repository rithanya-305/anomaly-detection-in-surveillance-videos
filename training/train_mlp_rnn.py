import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import torch
from torch.utils.data import DataLoader
from models.mlp_rnn import MLP_RNN
from training.rnn_dataset import ScoreSequenceDataset

dataset = ScoreSequenceDataset("results/anomaly_scores.npy")
loader = DataLoader(dataset, batch_size=32, shuffle=True)

model = MLP_RNN()
optimizer = torch.optim.Adam(model.parameters(), lr=1e-3)
loss_fn = torch.nn.MSELoss()

for epoch in range(5):
    total = 0
    for x,y in loader:
        pred = model(x)
        loss = loss_fn(pred, y)

        optimizer.zero_grad()
        loss.backward()
        optimizer.step()

        total += loss.item()

    print(f"Epoch {epoch+1} | Loss: {total/len(loader):.4f}")

torch.save(model.state_dict(), "models/mlp_rnn.pth")
print("✅ MLP-RNN trained and saved")
