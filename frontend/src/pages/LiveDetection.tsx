import { useState, useRef, useEffect, useCallback } from "react";
import { Camera, CameraOff, Pause, Play, AlertTriangle, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import StatusIndicator from "@/components/StatusIndicator";
import { addDetection } from "@/lib/detectionStore";
import { toast } from "sonner";

const LiveDetection = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const [isStreaming, setIsStreaming] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [status, setStatus] =
    useState<"idle" | "scanning" | "anomaly" | "safe">("idle");

  const [lastDetection, setLastDetection] = useState<{
    isAnomaly: boolean;
    confidence?: number;
    timestamp: Date;
  } | null>(null);

  const [detectionCount, setDetectionCount] = useState({
    anomalies: 0,
    safe: 0,
  });

  // -------------------------
  // CAMERA
  // -------------------------
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: false,
      });

      streamRef.current = stream;
      setIsStreaming(true);

      // IMPORTANT: attach stream AFTER render
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      }, 100);

      toast.success("Camera connected");
    } catch (err) {
      toast.error("Camera permission denied");
      console.error(err);
    }
  };

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsStreaming(false);
    setIsDetecting(false);
    setStatus("idle");
  }, []);

  // -------------------------
  // SEND FRAME TO BACKEND
  // -------------------------
  const detectFrame = async () => {
    if (!videoRef.current) return;

    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(videoRef.current, 0, 0);

    const base64Frame = canvas
      .toDataURL("image/jpeg")
      .split(",")[1];

    try {
      setStatus("scanning");

      const res = await fetch("http://127.0.0.1:5000/live_detect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ frame: base64Frame }),
      });

      const data = await res.json();

      const detection = {
        isAnomaly: data.isAnomaly,
        confidence: data.confidence,
        timestamp: new Date(),
      };

      setLastDetection(detection);

      if (data.isAnomaly) {
        setStatus("anomaly");
        setDetectionCount((p) => ({ ...p, anomalies: p.anomalies + 1 }));

        addDetection({
          id: crypto.randomUUID(),
          type: "live",
          timestamp: new Date(),
          status: "anomaly",
          confidence: data.confidence,
        });

        toast.error("Live Anomaly Detected", {
          description: `Confidence: ${(data.confidence * 100).toFixed(1)}%`,
        });
      } else {
        setStatus("safe");
        setDetectionCount((p) => ({ ...p, safe: p.safe + 1 }));
      }
    } catch (err) {
      console.error(err);
      toast.error("Live detection failed");
    }
  };

  // -------------------------
  // START / STOP DETECTION
  // -------------------------
  const startDetection = () => {
    if (!isStreaming) return;
    setIsDetecting(true);
    intervalRef.current = setInterval(detectFrame, 2000);
  };

  const stopDetection = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsDetecting(false);
    setStatus("idle");
  };

  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  // -------------------------
  // UI
  // -------------------------
  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Live Detection</h1>
          <StatusIndicator status={status} size="lg" />
        </div>

        <Card className="p-4">
          <div className="relative aspect-video bg-black rounded-lg overflow-hidden">

            {/* VIDEO IS ALWAYS RENDERED */}
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className={`w-full h-full object-cover ${
                isStreaming ? "block" : "hidden"
              }`}
            />

            {!isStreaming && (
              <div className="absolute inset-0 flex items-center justify-center">
                <CameraOff className="w-16 h-16 text-muted-foreground" />
              </div>
            )}
          </div>

          <div className="flex gap-3 mt-4">
            {!isStreaming ? (
              <Button onClick={startCamera}>
                <Camera className="w-4 h-4 mr-2" /> Start Camera
              </Button>
            ) : (
              <>
                <Button
                  onClick={isDetecting ? stopDetection : startDetection}
                  variant={isDetecting ? "destructive" : "default"}
                >
                  {isDetecting ? (
                    <>
                      <Pause className="w-4 h-4 mr-2" /> Stop Detection
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" /> Start Detection
                    </>
                  )}
                </Button>

                <Button variant="outline" onClick={stopCamera}>
                  <CameraOff className="w-4 h-4 mr-2" /> Disconnect
                </Button>
              </>
            )}
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default LiveDetection;
