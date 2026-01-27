import { AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";

export interface Detection {
  id: string;
  type: "video" | "live";
  fileName?: string;
  timestamp: Date;
  status: "safe" | "anomaly";
  anomalyType?: string;
  confidence?: number;
  thumbnailUrl?: string;
}

interface DetectionCardProps {
  detection: Detection;
}

const DetectionCard = ({ detection }: DetectionCardProps) => {
  const isAnomaly = detection.status === "anomaly";

  return (
    <Card
      className={`p-4 transition-all duration-200 hover:scale-[1.02] ${
        isAnomaly ? "border-destructive/50 glow-alert" : "border-success/30"
      }`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`p-3 rounded-lg ${
            isAnomaly ? "bg-destructive/10" : "bg-success/10"
          }`}
        >
          {isAnomaly ? (
            <AlertTriangle className="w-6 h-6 text-destructive" />
          ) : (
            <CheckCircle className="w-6 h-6 text-success" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-medium truncate">
              {detection.fileName || "Live Camera Feed"}
            </h3>
            <span
              className={`text-xs font-mono px-2 py-1 rounded ${
                detection.type === "video"
                  ? "bg-primary/10 text-primary"
                  : "bg-warning/10 text-warning"
              }`}
            >
              {detection.type === "video" ? "VIDEO" : "LIVE"}
            </span>
          </div>

          <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>{detection.timestamp.toLocaleString()}</span>
          </div>

          {isAnomaly && detection.anomalyType && (
            <div className="mt-2">
              <span className="text-sm text-destructive font-medium">
                {detection.anomalyType}
              </span>
              {detection.confidence && (
                <span className="text-xs text-muted-foreground ml-2">
                  ({(detection.confidence * 100).toFixed(1)}% confidence)
                </span>
              )}
            </div>
          )}

          {!isAnomaly && (
            <p className="mt-2 text-sm text-success">No anomalies detected</p>
          )}
        </div>
      </div>
    </Card>
  );
};

export default DetectionCard;
