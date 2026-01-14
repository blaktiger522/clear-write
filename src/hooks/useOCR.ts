import { useState, useCallback } from "react";
import Tesseract from "tesseract.js";

interface OCRResult {
  text: string;
  confidence: number;
}

interface OCRState {
  isProcessing: boolean;
  progress: number;
  status: string;
  result: OCRResult | null;
  error: string | null;
}

export const useOCR = () => {
  const [state, setState] = useState<OCRState>({
    isProcessing: false,
    progress: 0,
    status: "",
    result: null,
    error: null,
  });

  const processImage = useCallback(async (imageSource: string | File): Promise<OCRResult | null> => {
    setState({
      isProcessing: true,
      progress: 0,
      status: "Initializing...",
      result: null,
      error: null,
    });

    try {
      const result = await Tesseract.recognize(imageSource, "eng", {
        logger: (m) => {
          if (m.status === "recognizing text") {
            setState((prev) => ({
              ...prev,
              progress: Math.round(m.progress * 100),
              status: "Recognizing text...",
            }));
          } else if (m.status === "loading tesseract core") {
            setState((prev) => ({
              ...prev,
              progress: 5,
              status: "Loading OCR engine...",
            }));
          } else if (m.status === "initializing tesseract") {
            setState((prev) => ({
              ...prev,
              progress: 10,
              status: "Initializing...",
            }));
          } else if (m.status === "loading language traineddata") {
            setState((prev) => ({
              ...prev,
              progress: 20,
              status: "Loading language data...",
            }));
          } else if (m.status === "initializing api") {
            setState((prev) => ({
              ...prev,
              progress: 25,
              status: "Preparing analysis...",
            }));
          }
        },
      });

      const ocrResult: OCRResult = {
        text: result.data.text.trim(),
        confidence: result.data.confidence,
      };

      setState({
        isProcessing: false,
        progress: 100,
        status: "Complete!",
        result: ocrResult,
        error: null,
      });

      return ocrResult;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to process image";
      setState({
        isProcessing: false,
        progress: 0,
        status: "",
        result: null,
        error: errorMessage,
      });
      return null;
    }
  }, []);

  const reset = useCallback(() => {
    setState({
      isProcessing: false,
      progress: 0,
      status: "",
      result: null,
      error: null,
    });
  }, []);

  return {
    ...state,
    processImage,
    reset,
  };
};
