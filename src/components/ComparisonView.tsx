import { useState } from "react";
import { motion } from "framer-motion";
import { Download, Share2, Copy, Check, RefreshCw, Image, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ComparisonViewProps {
  originalImage: string;
  processedText: string;
  onReset: () => void;
}

const ComparisonView = ({ originalImage, processedText, onReset }: ComparisonViewProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(processedText);
      setCopied(true);
      toast.success("Text copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy text");
    }
  };

  const handleDownload = () => {
    const blob = new Blob([processedText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "recognized-text.txt";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Text file downloaded!");
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Recognized Handwriting",
          text: processedText,
        });
      } catch {
        // User cancelled sharing
      }
    } else {
      handleCopy();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-6xl mx-auto"
    >
      {/* Action buttons */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        <Button onClick={handleCopy} variant="secondary" className="gap-2">
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? "Copied!" : "Copy Text"}
        </Button>
        <Button onClick={handleDownload} variant="secondary" className="gap-2">
          <Download className="w-4 h-4" />
          Download
        </Button>
        <Button onClick={handleShare} variant="secondary" className="gap-2">
          <Share2 className="w-4 h-4" />
          Share
        </Button>
        <Button onClick={onReset} variant="outline" className="gap-2">
          <RefreshCw className="w-4 h-4" />
          New Image
        </Button>
      </div>

      {/* Comparison grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Original image */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-2xl shadow-card overflow-hidden"
        >
          <div className="flex items-center gap-2 px-4 py-3 bg-secondary/50 border-b border-border">
            <Image className="w-4 h-4 text-primary" />
            <span className="font-medium text-sm">Original Image</span>
          </div>
          <div className="p-4">
            <img
              src={originalImage}
              alt="Original handwriting"
              className="w-full h-auto rounded-lg object-contain max-h-[500px]"
            />
          </div>
        </motion.div>

        {/* Processed text */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-2xl shadow-card overflow-hidden flex flex-col"
        >
          <div className="flex items-center gap-2 px-4 py-3 bg-secondary/50 border-b border-border">
            <FileText className="w-4 h-4 text-primary" />
            <span className="font-medium text-sm">Recognized Text</span>
          </div>
          <div className="p-4 flex-1 overflow-auto">
            {processedText ? (
              <div className="prose prose-sm max-w-none">
                <pre className="whitespace-pre-wrap font-sans text-foreground text-base leading-relaxed bg-transparent p-0 m-0 overflow-visible">
                  {processedText}
                </pre>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                <p>No text could be recognized from this image.</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Tips section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-8 p-4 bg-accent/50 rounded-xl text-center"
      >
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Tip:</span> For best results, ensure 
          your handwriting is clear and the image has good lighting. You can try again with 
          a higher quality image if needed.
        </p>
      </motion.div>
    </motion.div>
  );
};

export default ComparisonView;
