import { useState } from "react";
import { motion } from "framer-motion";
import { Download, Share2, Copy, Check, RefreshCw, Image, FileText, Cpu, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { jsPDF } from "jspdf";
import { Badge } from "@/components/ui/badge";

interface ComparisonViewProps {
  originalImage: string;
  processedText: string;
  onReset: () => void;
  ocrEngine?: 'nanonets' | 'tesseract' | null;
  confidence?: number;
}

const ComparisonView = ({ 
  originalImage, 
  processedText, 
  onReset,
  ocrEngine,
  confidence 
}: ComparisonViewProps) => {
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  
  const engineLabel = ocrEngine === 'nanonets' ? 'Nanonets AI' : ocrEngine === 'tesseract' ? 'Tesseract' : null;

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

  const handleDownload = async () => {
    setIsDownloading(true);
    
    try {
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      const contentWidth = pageWidth - margin * 2;

      // Add title
      pdf.setFontSize(18);
      pdf.setFont("helvetica", "bold");
      pdf.text("ScribeScan - Recognized Document", margin, margin);

      // Add original image
      const img = new window.Image();
      img.crossOrigin = "anonymous";
      
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("Failed to load image"));
        img.src = originalImage;
      });

      // Calculate image dimensions to fit width while maintaining aspect ratio
      const imgAspectRatio = img.width / img.height;
      let imgWidth = contentWidth;
      let imgHeight = imgWidth / imgAspectRatio;
      
      // Limit image height to leave room for text
      const maxImgHeight = (pageHeight - margin * 2) * 0.4;
      if (imgHeight > maxImgHeight) {
        imgHeight = maxImgHeight;
        imgWidth = imgHeight * imgAspectRatio;
      }

      // Center the image
      const imgX = margin + (contentWidth - imgWidth) / 2;
      let currentY = margin + 15;

      // Add "Original Image" label
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "bold");
      pdf.text("Original Image:", margin, currentY);
      currentY += 5;

      // Add image
      pdf.addImage(img, "JPEG", imgX, currentY, imgWidth, imgHeight);
      currentY += imgHeight + 15;

      // Add "Recognized Text" label
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "bold");
      pdf.text("Recognized Text:", margin, currentY);
      currentY += 8;

      // Add processed text
      pdf.setFontSize(11);
      pdf.setFont("helvetica", "normal");
      
      const textLines = pdf.splitTextToSize(processedText || "No text recognized", contentWidth);
      
      // Check if we need to add pages for long text
      const lineHeight = 6;
      for (let i = 0; i < textLines.length; i++) {
        if (currentY + lineHeight > pageHeight - margin) {
          pdf.addPage();
          currentY = margin;
        }
        pdf.text(textLines[i], margin, currentY);
        currentY += lineHeight;
      }

      // Save the PDF
      pdf.save("scribescan-document.pdf");
      toast.success("PDF downloaded successfully!");
    } catch (error) {
      console.error("PDF generation error:", error);
      toast.error("Failed to generate PDF");
    } finally {
      setIsDownloading(false);
    }
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
        <Button 
          onClick={handleDownload} 
          variant="secondary" 
          className="gap-2"
          disabled={isDownloading}
        >
          <Download className="w-4 h-4" />
          {isDownloading ? "Generating..." : "Download PDF"}
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
          <div className="flex items-center justify-between px-4 py-3 bg-secondary/50 border-b border-border">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              <span className="font-medium text-sm">Recognized Text</span>
            </div>
            {engineLabel && (
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="gap-1 text-xs">
                  {ocrEngine === 'nanonets' ? (
                    <Zap className="w-3 h-3" />
                  ) : (
                    <Cpu className="w-3 h-3" />
                  )}
                  {engineLabel}
                </Badge>
                {confidence !== undefined && confidence > 0 && (
                  <Badge variant="outline" className="text-xs">
                    {Math.round(confidence)}% confidence
                  </Badge>
                )}
              </div>
            )}
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
