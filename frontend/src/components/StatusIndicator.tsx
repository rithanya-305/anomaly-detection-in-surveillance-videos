interface StatusIndicatorProps {
  status: "idle" | "scanning" | "anomaly" | "safe";
  size?: "sm" | "md" | "lg";
}

const StatusIndicator = ({ status, size = "md" }: StatusIndicatorProps) => {
  const sizeClasses = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4",
  };

  const statusClasses = {
    idle: "bg-muted-foreground",
    scanning: "bg-primary animate-pulse",
    anomaly: "bg-destructive animate-pulse",
    safe: "bg-success",
  };

  return (
    <div className="relative flex items-center justify-center">
      <div className={`rounded-full ${sizeClasses[size]} ${statusClasses[status]}`} />
      {(status === "scanning" || status === "anomaly") && (
        <div
          className={`absolute rounded-full ${sizeClasses[size]} ${statusClasses[status]} opacity-50 animate-ping`}
        />
      )}
    </div>
  );
};

export default StatusIndicator;
