import { motion } from "framer-motion";

export function TrialPeriodCircle({
  startTime,
  endTime,
}: {
  startTime: string;
  endTime: string;
}) {
  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();
  const now = Date.now();

  const total = end - start;
  const passed = Math.min(now - start, total);
  const remainingPercent = Math.max(0, ((total - passed) / total) * 100);
  const remainingDays = Math.ceil((end - now) / (1000 * 60 * 60 * 24));

  const size = 104;
  const radius = 46;
  const strokeWidth = 6;
  const circumference = 2 * Math.PI * radius;

  // 🔹 Simple color logic
  const getStrokeColor = () => {
    if (remainingDays <= 0) return "#ef4444"; // red-500
    if (remainingDays <= 3) return "#f59e0b"; // amber-500
    if (remainingDays <= 7) return "#eab308"; // yellow-500
    return "#10b981"; // emerald-500
  };

  const getTextColor = () => {
    if (remainingDays <= 0) return "text-red-400";
    if (remainingDays <= 3) return "text-amber-400";
    if (remainingDays <= 7) return "text-yellow-400";
    return "text-emerald-400";
  };

  const strokeColor = getStrokeColor();
  const textColor = getTextColor();

  return (
    <div className="relative flex flex-col items-center justify-center">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90 w-26 h-26"
      >
        {/* Background Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="gray"
          strokeWidth={strokeWidth}
          fill="transparent"
          opacity={0.3}
        />
        
        {/* Animated Progress */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={(circumference * remainingPercent) / 100}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: (circumference * remainingPercent) / 100 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          strokeLinecap="round"
        />
      </svg>

      {/* Center Text */}
      <div className="absolute text-center">
        <p className={`text-lg font-bold ${textColor}`}>
          {remainingDays > 0 ? remainingDays : 0}
        </p>
        <p className="text-[11px] text-gray-400 leading-tight">
          {remainingDays <= 0 ? "expired" : remainingDays === 1 ? "day left" : "days left"}
        </p>
      </div>
    </div>
  );
}