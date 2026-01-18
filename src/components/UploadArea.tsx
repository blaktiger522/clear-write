import { useCallback, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Upload, Camera, FileImage } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UploadAreaProps {
  onImageUpload: (file: File, preview: string) => void;
  isProcessing: boolean;
}

const UploadArea = ({ onImageUpload, isProcessing }: UploadAreaProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const processFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const preview = e.target?.result as string;
      onImageUpload(file, preview);
    };
    reader.readAsDataURL(file);
  }, [onImageUpload]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
    // Reset input so same file can be selected again
    e.target.value = "";
  }, [processFile]);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isProcessing) {
      setIsDragging(true);
    }
  }, [isProcessing]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Only set to false if we're leaving the drop zone entirely
    if (e.currentTarget === e.target) {
      setIsDragging(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (isProcessing) return;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  }, [isProcessing, processFile]);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleCameraClick = () => {
    cameraInputRef.current?.click();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="w-full max-w-xl mx-auto"
    >
      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={isProcessing}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileSelect}
        className="hidden"
        disabled={isProcessing}
      />

      {/* Upload card with drag-and-drop */}
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`
          bg-card rounded-2xl shadow-card p-8 md:p-10 transition-all duration-200
          ${isDragging 
            ? "ring-2 ring-primary ring-offset-2 ring-offset-background bg-accent/50" 
            : "hover:shadow-elevated"
          }
        `}
      >
        {/* Drag overlay */}
        {isDragging && (
          <div className="absolute inset-0 rounded-2xl bg-primary/5 flex items-center justify-center pointer-events-none z-10">
            <div className="text-center">
              <Upload className="w-12 h-12 text-primary mx-auto mb-2 animate-bounce" />
              <p className="text-lg font-medium text-primary">Drop your image here</p>
            </div>
          </div>
        )}

        <div className={`text-center mb-8 ${isDragging ? "opacity-30" : ""}`}>
          <div className="w-16 h-16 mx-auto rounded-2xl bg-accent flex items-center justify-center mb-4">
            <FileImage className="w-8 h-8 text-primary" />
          </div>
          <h3 className="font-display text-xl font-semibold text-foreground mb-2">
            Upload your document
          </h3>
          <p className="text-sm text-muted-foreground">
            Drag & drop an image, or use the buttons below
          </p>
        </div>

        {/* Buttons */}
        <div className={`flex flex-col sm:flex-row gap-4 ${isDragging ? "opacity-30" : ""}`}>
          <Button
            onClick={handleUploadClick}
            disabled={isProcessing}
            size="lg"
            className="flex-1 h-20 sm:h-14 text-xl sm:text-base gap-3"
          >
            <Upload className="w-7 h-7 sm:w-5 sm:h-5" />
            Upload Image
          </Button>
          
          <Button
            onClick={handleCameraClick}
            disabled={isProcessing}
            variant="secondary"
            size="lg"
            className="flex-1 h-20 sm:h-14 text-xl sm:text-base gap-3"
          >
            <Camera className="w-7 h-7 sm:w-5 sm:h-5" />
            Capture Photo
          </Button>
        </div>

        {/* Supported formats */}
        <p className={`text-xs text-muted-foreground text-center mt-6 ${isDragging ? "opacity-30" : ""}`}>
          Supports PNG, JPG, JPEG • Max 10MB
        </p>
      </div>
    </motion.div>
  );
};

export default UploadArea;
