import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Video, Camera, AlertTriangle, CheckCircle, Activity } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import StatusIndicator from "@/components/StatusIndicator";
import DetectionCard, { Detection } from "@/components/DetectionCard";
import { getDetections } from "@/lib/detectionStore";

const Dashboard = () => {
  const [detections, setDetections] = useState<Detection[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    anomalies: 0,
    safe: 0,
  });

  useEffect(() => {
    const stored = getDetections();
    setDetections(stored.slice(0, 5));
    setStats({
      total: stored.length,
      anomalies: stored.filter((d) => d.status === "anomaly").length,
      safe: stored.filter((d) => d.status === "safe").length,
    });
  }, []);

  return (
    <Layout>
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gradient">
            Anomaly Detection System
          </h1>
          <p className="text-muted-foreground text-lg">
             Surveillance video with real time analysis
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-4">
          <Link to="/upload">
            <Card className="p-6 hover:border-primary/50 transition-all duration-200 hover:glow-primary group cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="p-4 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <Video className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Upload Video</h2>
                  <p className="text-muted-foreground">
                    Analyze recorded footage for anomalies
                  </p>
                </div>
              </div>
            </Card>
          </Link>

          <Link to="/live">
            <Card className="p-6 hover:border-primary/50 transition-all duration-200 hover:glow-primary group cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="p-4 rounded-xl bg-warning/10 group-hover:bg-warning/20 transition-colors">
                  <Camera className="w-8 h-8 text-warning" />
                </div>
                <div className="flex items-center gap-3">
                  <div>
                    <h2 className="text-xl font-semibold">Live Detection</h2>
                    <p className="text-muted-foreground">
                      Real-time monitoring with your camera
                    </p>
                  </div>
                  <StatusIndicator status="idle" size="lg" />
                </div>
              </div>
            </Card>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="p-4 text-center">
            <Activity className="w-6 h-6 mx-auto text-primary mb-2" />
            <p className="text-3xl font-bold font-mono">{stats.total}</p>
            <p className="text-sm text-muted-foreground">Total Scans</p>
          </Card>
          <Card className="p-4 text-center">
            <AlertTriangle className="w-6 h-6 mx-auto text-destructive mb-2" />
            <p className="text-3xl font-bold font-mono text-destructive">
              {stats.anomalies}
            </p>
            <p className="text-sm text-muted-foreground">Anomalies Found</p>
          </Card>
          <Card className="p-4 text-center">
            <CheckCircle className="w-6 h-6 mx-auto text-success mb-2" />
            <p className="text-3xl font-bold font-mono text-success">
              {stats.safe}
            </p>
            <p className="text-sm text-muted-foreground">Safe Videos</p>
          </Card>
        </div>

        {/* Recent Activity */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Recent Activity</h2>
            <Link to="/results">
              <Button variant="ghost" size="sm" className="text-primary">
                View All
              </Button>
            </Link>
          </div>

          {detections.length === 0 ? (
            <Card className="p-8 text-center">
              <Activity className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No detections yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Upload a video or start live detection to begin
              </p>
            </Card>
          ) : (
            <div className="space-y-3">
              {detections.map((detection) => (
                <DetectionCard key={detection.id} detection={detection} />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
