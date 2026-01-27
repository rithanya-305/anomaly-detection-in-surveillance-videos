import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, Video, X, Play, Loader2, CheckCircle, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Layout from "@/components/Layout";
import { addDetection, simulateDetection } from "@/lib/detectionStore";
import { toast } from "sonner";

const UploadVideo = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{
    isAnomaly: boolean;
    type?: string;
    confidence?: number;
  } | null>(null);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith("video/")) {
      setFile(droppedFile);
      setVideoUrl(URL.createObjectURL(droppedFile));
      setResult(null);
    } else {
      toast.error("Please upload a video file");
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setVideoUrl(URL.createObjectURL(selectedFile));
      setResult(null);
    }
  };

  const clearFile = () => {
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    setFile(null);
    setVideoUrl(null);
    setResult(null);
    setProgress(0);
  };

  const analyzeVideo = async () => {
    if (!file) return;

    setIsAnalyzing(true);
    setProgress(0);

    // Simulate analysis progress
    for (let i = 0; i <= 100; i += 5) {
      await new Promise((r) => setTimeout(r, 100));
      setProgress(i);
    }

    // Simulate detection result
    const detectionResult = simulateDetection();
    setResult(detectionResult);

    // Store the result
    addDetection({
      id: crypto.randomUUID(),
      type: "video",
      fileName: file.name,
      timestamp: new Date(),
      status: detectionResult.isAnomaly ? "anomaly" : "safe",
      anomalyType: detectionResult.type,
      confidence: detectionResult.confidence,
    });

    setIsAnalyzing(false);

    if (detectionResult.isAnomaly) {
      toast.error(`Anomaly detected: ${detectionResult.type}`);
    } else {
      toast.success("No anomalies detected");
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Upload Video</h1>
          <p className="text-muted-foreground">
            Upload surveillance footage for anomaly detection
          </p>
        </div>

        {!file ? (
          <Card
            className="p-12 border-dashed border-2 hover:border-primary/50 transition-colors cursor-pointer"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => document.getElementById("file-input")?.click()}
          >
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Upload className="w-8 h-8 text-primary" />
              </div>
              <div>
                <p className="text-lg font-medium">
                  Drop your video here or click to browse
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Supports MP4, AVI, MOV, WebM
                </p>
              </div>
            </div>
            <input
              id="file-input"
              type="file"
              accept="video/*"
              className="hidden"
              onChange={handleFileSelect}
            />
          </Card>
        ) : (
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Video className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium truncate max-w-xs">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={clearFile}
                disabled={isAnalyzing}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {videoUrl && (
              <div className="relative aspect-video rounded-lg overflow-hidden bg-secondary">
                <video
                  src={videoUrl}
                  controls
                  className="w-full h-full object-contain"
                />
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto" />
                      <p className="font-medium">Analyzing video...</p>
                      <div className="w-48 mx-auto">
                        <Progress value={progress} className="h-2" />
                      </div>
                      <p className="text-sm text-muted-foreground font-mono">
                        {progress}%
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {result && (
              <Card
                className={`p-4 ${
                  result.isAnomaly
                    ? "border-destructive/50 bg-destructive/5"
                    : "border-success/50 bg-success/5"
                }`}
              >
                <div className="flex items-center gap-3">
                  {result.isAnomaly ? (
                    <AlertTriangle className="w-6 h-6 text-destructive" />
                  ) : (
                    <CheckCircle className="w-6 h-6 text-success" />
                  )}
                  <div>
                    <p className="font-medium">
                      {result.isAnomaly
                        ? `Anomaly Detected: ${result.type}`
                        : "No Anomalies Detected"}
                    </p>
                    {result.confidence && (
                      <p className="text-sm text-muted-foreground">
                        Confidence: {(result.confidence * 100).toFixed(1)}%
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            )}

            <div className="flex gap-3">
              <Button
                onClick={analyzeVideo}
                disabled={isAnalyzing}
                className="flex-1 gradient-cyber text-primary-foreground"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Analyze Video
                  </>
                )}
              </Button>
              {result && (
                <Button variant="outline" onClick={() => navigate("/results")}>
                  View Results
                </Button>
              )}
            </div>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default UploadVideo;
