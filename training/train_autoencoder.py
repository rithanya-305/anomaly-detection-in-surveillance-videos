import torch
from torch.utils.data import DataLoader
from models.autoencoder import AutoEncoder
from training.dataset import ClipDataset
from tqdm import tqdm

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print("Using device:", device)

dataset = ClipDataset("data/clips/train")
loader = DataLoader(dataset, batch_size=8, shuffle=True)

model = AutoEncoder().to(device)
optimizer = torch.optim.Adam(model.parameters(), lr=1e-3)
criterion = torch.nn.MSELoss()

EPOCHS = 5

for epoch in range(EPOCHS):
    total_loss = 0
    for clips in tqdm(loader):
        clips = clips.to(device)

        output = model(clips)
        loss = criterion(output, clips)

        optimizer.zero_grad()
        loss.backward()
        optimizer.step()

        total_loss += loss.item()

    print(f"Epoch {epoch+1}/{EPOCHS} | Loss: {total_loss/len(loader):.4f}")

torch.save(model.state_dict(), "models/autoencoder.pth")
print("✅ Autoencoder trained and saved")
