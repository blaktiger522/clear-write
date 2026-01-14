import { motion } from "framer-motion";
import { Loader2, Brain, FileText, CheckCircle } from "lucide-react";

interface ProcessingStateProps {
  progress: number;
  status: string;
}

const ProcessingState = ({ progress, status }: ProcessingStateProps) => {
  const steps = [
    { icon: FileText, label: "Analyzing image", threshold: 0 },
    { icon: Brain, label: "Recognizing text", threshold: 30 },
    { icon: CheckCircle, label: "Finalizing", threshold: 80 },
  ];

  const getCurrentStep = () => {
    if (progress >= 80) return 2;
    if (progress >= 30) return 1;
    return 0;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="w-full max-w-md mx-auto text-center py-8"
    >
      {/* Animated loader */}
      <div className="relative w-24 h-24 mx-auto mb-6">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full border-4 border-primary/20"
        />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <Brain className="w-10 h-10 text-primary animate-pulse-soft" />
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative h-2 bg-secondary rounded-full overflow-hidden mb-4">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
          className="absolute inset-y-0 left-0 bg-primary rounded-full"
          style={{ background: "var(--gradient-hero)" }}
        />
      </div>

      {/* Progress percentage */}
      <p className="font-display text-2xl font-bold text-foreground mb-2">
        {Math.round(progress)}%
      </p>

      {/* Status text */}
      <p className="text-muted-foreground mb-6">{status}</p>

      {/* Steps indicator */}
      <div className="flex justify-center gap-8">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index <= getCurrentStep();
          const isCurrent = index === getCurrentStep();
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col items-center gap-2"
            >
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300
                ${isActive 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-secondary text-muted-foreground"
                }
                ${isCurrent ? "ring-4 ring-primary/30" : ""}
              `}>
                <Icon className="w-5 h-5" />
              </div>
              <span className={`text-xs ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                {step.label}
              </span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default ProcessingState;
