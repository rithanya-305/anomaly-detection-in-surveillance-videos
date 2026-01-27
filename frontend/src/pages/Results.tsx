import { useState, useEffect } from "react";
import { Trash2, Filter, AlertTriangle, CheckCircle, Video, Camera } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import DetectionCard, { Detection } from "@/components/DetectionCard";
import { getDetections, clearDetections } from "@/lib/detectionStore";
import { toast } from "sonner";

type FilterType = "all" | "anomaly" | "safe" | "video" | "live";

const Results = () => {
  const [detections, setDetections] = useState<Detection[]>([]);
  const [filter, setFilter] = useState<FilterType>("all");

  useEffect(() => {
    setDetections(getDetections());
  }, []);

  const handleClearAll = () => {
    clearDetections();
    setDetections([]);
    toast.success("All results cleared");
  };

  const filteredDetections = detections.filter((d) => {
    if (filter === "all") return true;
    if (filter === "anomaly") return d.status === "anomaly";
    if (filter === "safe") return d.status === "safe";
    if (filter === "video") return d.type === "video";
    if (filter === "live") return d.type === "live";
    return true;
  });

  const stats = {
    total: detections.length,
    anomalies: detections.filter((d) => d.status === "anomaly").length,
    safe: detections.filter((d) => d.status === "safe").length,
    videos: detections.filter((d) => d.type === "video").length,
    live: detections.filter((d) => d.type === "live").length,
  };

  const filterButtons: { value: FilterType; label: string; icon?: React.ReactNode }[] = [
    { value: "all", label: `All (${stats.total})` },
    { value: "anomaly", label: `Anomalies (${stats.anomalies})`, icon: <AlertTriangle className="w-3 h-3" /> },
    { value: "safe", label: `Safe (${stats.safe})`, icon: <CheckCircle className="w-3 h-3" /> },
    { value: "video", label: `Videos (${stats.videos})`, icon: <Video className="w-3 h-3" /> },
    { value: "live", label: `Live (${stats.live})`, icon: <Camera className="w-3 h-3" /> },
  ];

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Detection Results</h1>
            <p className="text-muted-foreground">
              History of all anomaly detections
            </p>
          </div>
          {detections.length > 0 && (
            <Button variant="destructive" size="sm" onClick={handleClearAll}>
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All
            </Button>
          )}
        </div>

        {/* Filter buttons */}
        <div className="flex flex-wrap gap-2">
          <Filter className="w-4 h-4 text-muted-foreground self-center mr-1" />
          {filterButtons.map((btn) => (
            <Button
              key={btn.value}
              variant={filter === btn.value ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(btn.value)}
              className={filter === btn.value ? "gradient-cyber text-primary-foreground" : ""}
            >
              {btn.icon && <span className="mr-1">{btn.icon}</span>}
              {btn.label}
            </Button>
          ))}
        </div>

        {/* Results list */}
        {filteredDetections.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="space-y-4">
              {detections.length === 0 ? (
                <>
                  <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center">
                    <Video className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">No detections yet</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Upload a video or start live detection to see results here
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <Filter className="w-12 h-12 mx-auto text-muted-foreground" />
                  <p className="text-muted-foreground">
                    No results match the selected filter
                  </p>
                </>
              )}
            </div>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredDetections.map((detection) => (
              <DetectionCard key={detection.id} detection={detection} />
            ))}
          </div>
        )}

        {/* Summary stats */}
        {detections.length > 0 && (
          <Card className="p-4 mt-6">
            <h3 className="font-medium mb-3">Summary Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold font-mono">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total Scans</p>
              </div>
              <div>
                <p className="text-2xl font-bold font-mono text-destructive">
                  {stats.anomalies}
                </p>
                <p className="text-xs text-muted-foreground">Anomalies</p>
              </div>
              <div>
                <p className="text-2xl font-bold font-mono text-success">
                  {stats.safe}
                </p>
                <p className="text-xs text-muted-foreground">Safe</p>
              </div>
              <div>
                <p className="text-2xl font-bold font-mono text-primary">
                  {stats.total > 0
                    ? ((stats.anomalies / stats.total) * 100).toFixed(1)
                    : 0}
                  %
                </p>
                <p className="text-xs text-muted-foreground">Anomaly Rate</p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Results;
