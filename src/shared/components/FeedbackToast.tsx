import { CheckCircle, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/shared/utils";

interface FeedbackToastProps {
  type: "success" | "error" | "info";
  title: string;
  description?: string;
  onClose?: () => void;
}

export const FeedbackToast = ({ type, title, description, onClose }: FeedbackToastProps) => {
  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <AlertCircle className="w-5 h-5 text-red-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />
  };

  const bgColors = {
    success: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800",
    error: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800", 
    info: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
  };

  return (
    <div className={cn(
      "flex items-start gap-3 p-4 rounded-lg border shadow-sm animate-in slide-in-from-top-2 duration-300",
      bgColors[type]
    )}>
      {icons[type]}
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-foreground">{title}</h4>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      {onClose && (
        <button 
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};