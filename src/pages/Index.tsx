import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import UploadArea from "@/components/UploadArea";
import HowItWorks from "@/components/HowItWorks";
import ProcessingState from "@/components/ProcessingState";
import ComparisonView from "@/components/ComparisonView";
import { useOCR } from "@/hooks/useOCR";
import { useHistory } from "@/contexts/HistoryContext";
import { useSettings } from "@/contexts/SettingsContext";
import { toast } from "sonner";

type AppState = "upload" | "processing" | "result";

const Index = () => {
  const [appState, setAppState] = useState<AppState>("upload");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [processedText, setProcessedText] = useState<string>("");
  const [confidence, setConfidence] = useState<number>(0);
  
  const { isProcessing, progress, status, processImage, reset: resetOCR } = useOCR();
  const { addToHistory } = useHistory();
  const { settings } = useSettings();

  const handleImageUpload = useCallback(async (file: File, preview: string) => {
    setUploadedImage(preview);
    setAppState("processing");

    const result = await processImage(file);
    
    if (result) {
      setProcessedText(result.text);
      setConfidence(result.confidence);
      setAppState("result");
      
      // Auto-save to history if enabled
      if (settings.autoSaveHistory) {
        addToHistory({
          originalImage: preview,
          processedText: result.text,
          confidence: result.confidence,
        });
      }
      
      if (result.text) {
        toast.success("Text recognized successfully!", {
          description: `Confidence: ${Math.round(result.confidence)}%`,
        });
      } else {
        toast.info("No text was found in this image", {
          description: "Try uploading a clearer image with visible handwriting.",
        });
      }
    } else {
      toast.error("Failed to process image", {
        description: "Please try again with a different image.",
      });
      handleReset();
    }
  }, [processImage, settings.autoSaveHistory, addToHistory]);

  const handleReset = useCallback(() => {
    setAppState("upload");
    setUploadedImage(null);
    setProcessedText("");
    setConfidence(0);
    resetOCR();
  }, [resetOCR]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        <AnimatePresence mode="wait">
          {appState === "upload" && (
            <motion.div
              key="upload"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <HeroSection />
              <section className="container mx-auto px-4 pb-8">
                <UploadArea
                  onImageUpload={handleImageUpload}
                  isProcessing={isProcessing}
                />
              </section>
              <HowItWorks />
            </motion.div>
          )}

          {appState === "processing" && (
            <motion.div
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="container mx-auto px-4 py-16"
            >
              <ProcessingState progress={progress} status={status} />
              
              {/* Show preview of uploaded image */}
              {uploadedImage && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-8 max-w-md mx-auto"
                >
                  <div className="bg-card rounded-xl shadow-soft p-3">
                    <img
                      src={uploadedImage}
                      alt="Processing"
                      className="w-full h-auto rounded-lg object-contain max-h-48 opacity-60"
                    />
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {appState === "result" && uploadedImage && (
            <motion.div
              key="result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="container mx-auto px-4 py-8 md:py-12"
            >
              <div className="text-center mb-8">
                <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
                  Recognition Complete!
                </h2>
                <p className="text-muted-foreground">
                  Compare your original image with the recognized text below.
                </p>
              </div>
              
              <ComparisonView
                originalImage={uploadedImage}
                processedText={processedText}
                onReset={handleReset}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
