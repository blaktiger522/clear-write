import { useState, useCallback } from "react";
import Tesseract from "tesseract.js";
import { supabase } from "@/integrations/supabase/client";

export type OCREngine = "nanonets" | "tesseract";

export interface OCRResult {
  text: string;
  confidence: number;
  engine: OCREngine;
}

interface OCRState {
  isProcessing: boolean;
  progress: number;
  status: string;
  result: OCRResult | null;
  error: string | null;
}

const processWithNanonets = async (
  file: File,
  onProgress: (progress: number, status: string) => void
): Promise<OCRResult> => {
  onProgress(10, "Uploading to Nanonets...");

  const formData = new FormData();
  formData.append("image", file, file.name);

  onProgress(30, "Processing with Nanonets OCR...");

  const { data, error } = await supabase.functions.invoke("ocr-process", {
    body: formData,
  });

  if (error) {
    throw new Error(error.message || "Nanonets OCR failed");
  }

  if (data?.error) {
    throw new Error(data.error);
  }

  onProgress(90, "Finalizing...");

  return {
    text: data.text || "",
    confidence: data.confidence || 0,
    engine: "nanonets",
  };
};

const processWithTesseract = async (
  imageSource: string | File,
  language: string,
  onProgress: (progress: number, status: string) => void
): Promise<OCRResult> => {
  onProgress(5, "Falling back to Tesseract OCR...");

  const result = await Tesseract.recognize(imageSource, language, {
    logger: (m) => {
      if (m.status === "recognizing text") {
        onProgress(30 + Math.round(m.progress * 60), "Recognizing text (Tesseract)...");
      } else if (m.status === "loading tesseract core") {
        onProgress(10, "Loading Tesseract engine...");
      } else if (m.status === "initializing tesseract") {
        onProgress(15, "Initializing Tesseract...");
      } else if (m.status === "loading language traineddata") {
        onProgress(20, "Loading language data...");
      } else if (m.status === "initializing api") {
        onProgress(25, "Preparing Tesseract analysis...");
      }
    },
  });

  return {
    text: result.data.text.trim(),
    confidence: result.data.confidence,
    engine: "tesseract",
  };
};

export const useOCR = () => {
  const [state, setState] = useState<OCRState>({
    isProcessing: false,
    progress: 0,
    status: "",
    result: null,
    error: null,
  });

  const updateProgress = useCallback((progress: number, status: string) => {
    setState((prev) => ({ ...prev, progress, status }));
  }, []);

  const processImage = useCallback(
    async (
      imageSource: string | File,
      language: string = "eng"
    ): Promise<OCRResult | null> => {
      setState({
        isProcessing: true,
        progress: 0,
        status: "Initializing...",
        result: null,
        error: null,
      });

      let ocrResult: OCRResult | null = null;

      // Try Nanonets first (primary engine)
      if (imageSource instanceof File) {
        try {
          ocrResult = await processWithNanonets(imageSource, updateProgress);
        } catch (nanonetsError) {
          console.warn("Nanonets OCR failed, falling back to Tesseract:", nanonetsError);
          // Fall through to Tesseract
        }
      }

      // Fallback to Tesseract if Nanonets failed or input is a string URL
      if (!ocrResult) {
        try {
          ocrResult = await processWithTesseract(imageSource, language, updateProgress);
        } catch (tesseractError) {
          const errorMessage =
            tesseractError instanceof Error
              ? tesseractError.message
              : "Failed to process image";
          setState({
            isProcessing: false,
            progress: 0,
            status: "",
            result: null,
            error: errorMessage,
          });
          return null;
        }
      }

      setState({
        isProcessing: false,
        progress: 100,
        status: "Complete!",
        result: ocrResult,
        error: null,
      });

      return ocrResult;
    },
    [updateProgress]
  );

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
