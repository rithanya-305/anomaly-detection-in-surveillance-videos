import { Detection } from "@/components/DetectionCard";

const STORAGE_KEY = "anomaly_detections";

export const getDetections = (): Detection[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return parsed.map((d: Detection) => ({
      ...d,
      timestamp: new Date(d.timestamp),
    }));
  } catch {
    return [];
  }
};

export const addDetection = (detection: Detection): void => {
  const existing = getDetections();
  const updated = [detection, ...existing].slice(0, 100); // Keep last 100
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

export const clearDetections = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};

// Simulated anomaly types for demo
export const anomalyTypes = [
  "Suspicious Movement",
  "Unauthorized Access",
  "Unusual Activity",
  "Object Left Behind",
  "Crowd Formation",
  "Rapid Motion",
];

export const simulateDetection = (): { isAnomaly: boolean; type?: string; confidence?: number } => {
  const isAnomaly = Math.random() < 0.3; // 30% chance of anomaly
  if (isAnomaly) {
    return {
      isAnomaly: true,
      type: anomalyTypes[Math.floor(Math.random() * anomalyTypes.length)],
      confidence: 0.7 + Math.random() * 0.25,
    };
  }
  return { isAnomaly: false };
};
