import numpy as np
import matplotlib
matplotlib.use("TkAgg")   # IMPORTANT for Windows
import matplotlib.pyplot as plt
import os

# Path to saved anomaly scores
SCORES_PATH = "results/anomaly_scores.npy"
SAVE_PATH = "results/anomaly_graph.png"

def main():
    if not os.path.exists(SCORES_PATH):
        print("❌ anomaly_scores.npy not found. Run anomaly_score.py first.")
        return

    # Load scores
    scores = np.load(SCORES_PATH)
    print(f"✅ Loaded anomaly scores: {scores.shape}")

    # Plot
    plt.figure(figsize=(12, 4))
    plt.plot(scores, color="blue", linewidth=1)
    plt.title("Anomaly Scores Over Time")
    plt.xlabel("Clip Index")
    plt.ylabel("Reconstruction Error")
    plt.grid(True)

    # Save graph
    plt.savefig(SAVE_PATH)
    print(f"💾 Graph saved to {SAVE_PATH}")

    # Show graph
    plt.show()

if __name__ == "__main__":
    main()

