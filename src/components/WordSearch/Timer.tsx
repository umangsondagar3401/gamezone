import React, { useEffect, useState } from "react";

interface TimerProps {
  isActive: boolean;
  onTimeUpdate?: (seconds: number) => void;
}

const Timer: React.FC<TimerProps> = ({ isActive, onTimeUpdate }) => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!isActive) return;
    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isActive]);

  // Notify parent when seconds changes
  useEffect(() => {
    if (onTimeUpdate) onTimeUpdate(seconds);
  }, [seconds, onTimeUpdate]);

  return (
    <div className="text-center text-lg font-semibold">
      Time: {Math.floor(seconds / 60)}:
      {(seconds % 60).toString().padStart(2, "0")}
    </div>
  );
};

export default React.memo(Timer);
