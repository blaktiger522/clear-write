import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Image, X, FileImage } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UploadAreaProps {
  onImageUpload: (file: File, preview: string) => void;
  isProcessing: boolean;
}

const UploadArea = ({ onImageUpload, isProcessing }: UploadAreaProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  }, []);

  const processFile = (file: File) => {
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
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-300
          ${isDragging 
            ? "border-primary bg-accent scale-[1.02]" 
            : "border-border bg-card hover:border-primary/50 hover:bg-accent/50"
          }
          ${isProcessing ? "pointer-events-none opacity-60" : ""}
        `}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          disabled={isProcessing}
        />
        
        <div className="p-8 md:p-12 text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={isDragging ? "dragging" : "default"}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center"
            >
              <div className={`
                w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center mb-4
                ${isDragging ? "bg-primary" : "bg-secondary"}
                transition-colors duration-300
              `}>
                {isDragging ? (
                  <FileImage className="w-8 h-8 md:w-10 md:h-10 text-primary-foreground" />
                ) : (
                  <Upload className="w-8 h-8 md:w-10 md:h-10 text-muted-foreground" />
                )}
              </div>

              <h3 className="font-display text-lg md:text-xl font-semibold text-foreground mb-2">
                {isDragging ? "Drop your image here" : "Upload your handwritten document"}
              </h3>
              
              <p className="text-sm text-muted-foreground mb-4">
                Drag and drop or click to browse
              </p>

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Image className="w-4 h-4" />
                <span>PNG, JPG, JPEG up to 10MB</span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default UploadArea;
