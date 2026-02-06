import { useState } from "react";
import { motion } from "framer-motion";
import { Download, Copy, Check, RefreshCw, Image, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { jsPDF } from "jspdf";

interface ComparisonViewProps {
  originalImage: string;
  processedText: string;
  onReset: () => void;
}

const ComparisonView = ({ originalImage, processedText, onReset }: ComparisonViewProps) => {
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

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
      const margin = 15;
      const contentWidth = pageWidth - margin * 2;

      // --- Header bar ---
      pdf.setFillColor(37, 99, 235); // primary blue
      pdf.rect(0, 0, pageWidth, 18, "F");
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(255, 255, 255);
      pdf.text("ScribeScan — Recognized Document", margin, 12);

      // Reset text color
      pdf.setTextColor(50, 50, 50);

      let currentY = 28;

      // --- Date line ---
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(130, 130, 130);
      const dateStr = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
      pdf.text(`Generated: ${dateStr}`, margin, currentY);
      currentY += 8;

      // --- Divider line ---
      pdf.setDrawColor(220, 220, 220);
      pdf.setLineWidth(0.5);
      pdf.line(margin, currentY, pageWidth - margin, currentY);
      currentY += 8;

      // --- Original Image Section ---
      pdf.setTextColor(37, 99, 235);
      pdf.setFontSize(11);
      pdf.setFont("helvetica", "bold");
      pdf.text("ORIGINAL IMAGE", margin, currentY);
      currentY += 6;

      // Load image
      const img = new window.Image();
      img.crossOrigin = "anonymous";
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("Failed to load image"));
        img.src = originalImage;
      });

      // Calculate image dimensions
      const imgAspectRatio = img.width / img.height;
      const maxImgWidth = contentWidth - 10;
      let imgWidth = maxImgWidth;
      let imgHeight = imgWidth / imgAspectRatio;

      const maxImgHeight = (pageHeight - margin * 2) * 0.38;
      if (imgHeight > maxImgHeight) {
        imgHeight = maxImgHeight;
        imgWidth = imgHeight * imgAspectRatio;
      }

      // Draw framed box for image
      const imgBoxX = margin;
      const imgBoxY = currentY;
      const imgBoxW = contentWidth;
      const imgBoxH = imgHeight + 10;

      pdf.setDrawColor(200, 200, 200);
      pdf.setLineWidth(0.3);
      pdf.setFillColor(248, 249, 250);
      pdf.roundedRect(imgBoxX, imgBoxY, imgBoxW, imgBoxH, 3, 3, "FD");

      // Center image inside box
      const imgX = imgBoxX + (imgBoxW - imgWidth) / 2;
      const imgY = imgBoxY + 5;
      pdf.addImage(img, "JPEG", imgX, imgY, imgWidth, imgHeight);
      currentY = imgBoxY + imgBoxH + 10;

      // --- Divider line ---
      pdf.setDrawColor(220, 220, 220);
      pdf.setLineWidth(0.5);
      pdf.line(margin, currentY, pageWidth - margin, currentY);
      currentY += 8;

      // --- Recognized Text Section ---
      pdf.setTextColor(37, 99, 235);
      pdf.setFontSize(11);
      pdf.setFont("helvetica", "bold");
      pdf.text("RECOGNIZED TEXT", margin, currentY);
      currentY += 6;

      // Prepare text lines
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(50, 50, 50);
      const textLines = pdf.splitTextToSize(processedText || "No text recognized", contentWidth - 14);
      const lineHeight = 5.5;
      const textBlockHeight = Math.min(textLines.length * lineHeight + 10, pageHeight - currentY - margin - 10);

      // Draw framed box for text
      const textBoxX = margin;
      const textBoxY = currentY;
      const textBoxW = contentWidth;
      const textBoxH = Math.max(textBlockHeight, 30);

      pdf.setDrawColor(200, 200, 200);
      pdf.setLineWidth(0.3);
      pdf.setFillColor(255, 255, 255);
      pdf.roundedRect(textBoxX, textBoxY, textBoxW, textBoxH, 3, 3, "FD");

      // Add text inside box
      let textY = textBoxY + 7;
      for (let i = 0; i < textLines.length; i++) {
        if (textY + lineHeight > pageHeight - margin) {
          // Footer on current page
          pdf.setDrawColor(220, 220, 220);
          pdf.setLineWidth(0.3);
          pdf.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);
          pdf.setFontSize(8);
          pdf.setTextColor(160, 160, 160);
          pdf.text("ScribeScan • Handwriting Recognition", margin, pageHeight - 7);
          pdf.text(`Page ${pdf.getNumberOfPages()}`, pageWidth - margin - 15, pageHeight - 7);

          pdf.addPage();
          textY = margin + 5;

          // Continuation header
          pdf.setFillColor(245, 247, 250);
          pdf.rect(0, 0, pageWidth, 12, "F");
          pdf.setFontSize(9);
          pdf.setTextColor(130, 130, 130);
          pdf.setFont("helvetica", "italic");
          pdf.text("Recognized Text (continued)", margin, 8);
          textY = 20;

          pdf.setFontSize(10);
          pdf.setFont("helvetica", "normal");
          pdf.setTextColor(50, 50, 50);
        }
        pdf.text(textLines[i], textBoxX + 7, textY);
        textY += lineHeight;
      }

      // --- Footer ---
      pdf.setDrawColor(220, 220, 220);
      pdf.setLineWidth(0.3);
      pdf.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);
      pdf.setFontSize(8);
      pdf.setTextColor(160, 160, 160);
      pdf.setFont("helvetica", "normal");
      pdf.text("ScribeScan • Handwriting Recognition", margin, pageHeight - 7);
      pdf.text(`Page ${pdf.getNumberOfPages()}`, pageWidth - margin - 15, pageHeight - 7);

      pdf.save("scribescan-document.pdf");
      toast.success("PDF downloaded successfully!");
    } catch (error) {
      console.error("PDF generation error:", error);
      toast.error("Failed to generate PDF");
    } finally {
      setIsDownloading(false);
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
