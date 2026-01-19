import { useState, useCallback } from "react";
import Tesseract from "tesseract.js";
import { supabase } from "@/integrations/supabase/client";

interface OCRResult {
  text: string;
  confidence: number;
  engine: 'nanonets' | 'tesseract';
}

interface OCRState {
  isProcessing: boolean;
  progress: number;
  status: string;
  result: OCRResult | null;
  error: string | null;
  engine: 'nanonets' | 'tesseract' | null;
}

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export const useOCR = () => {
  const [state, setState] = useState<OCRState>({
    isProcessing: false,
    progress: 0,
    status: "",
    result: null,
    error: null,
    engine: null,
  });

  const processWithNanonets = async (imageSource: File): Promise<OCRResult | null> => {
    setState((prev) => ({
      ...prev,
      progress: 10,
      status: "Preparing image for Nanonets...",
      engine: 'nanonets',
    }));

    const imageBase64 = await fileToBase64(imageSource);

    setState((prev) => ({
      ...prev,
      progress: 20,
      status: "Sending to Nanonets OCR...",
    }));

    const { data, error } = await supabase.functions.invoke('ocr-process', {
      body: {
        imageBase64,
        fileName: imageSource.name,
      },
    });

    if (error) {
      console.error('Nanonets edge function error:', error);
      throw new Error(error.message || 'Edge function failed');
    }

    if (data.error || data.fallback) {
      console.warn('Nanonets returned error, triggering fallback:', data.error);
      throw new Error(data.error || 'Nanonets processing failed');
    }

    setState((prev) => ({
      ...prev,
      progress: 90,
      status: "Processing complete!",
    }));

    return {
      text: data.text,
      confidence: data.confidence,
      engine: 'nanonets',
    };
  };

  const processWithTesseract = async (imageSource: string | File, language: string = "eng"): Promise<OCRResult | null> => {
    setState((prev) => ({
      ...prev,
      progress: 30,
      status: "Falling back to Tesseract...",
      engine: 'tesseract',
    }));

    const result = await Tesseract.recognize(imageSource, language, {
      logger: (m) => {
        if (m.status === "recognizing text") {
          setState((prev) => ({
            ...prev,
            progress: 30 + Math.round(m.progress * 60),
            status: "Recognizing text with Tesseract...",
          }));
        } else if (m.status === "loading tesseract core") {
          setState((prev) => ({
            ...prev,
            progress: 35,
            status: "Loading Tesseract OCR engine...",
          }));
        } else if (m.status === "initializing tesseract") {
          setState((prev) => ({
            ...prev,
            progress: 40,
            status: "Initializing Tesseract...",
          }));
        } else if (m.status === "loading language traineddata") {
          setState((prev) => ({
            ...prev,
            progress: 45,
            status: "Loading language data...",
          }));
        } else if (m.status === "initializing api") {
          setState((prev) => ({
            ...prev,
            progress: 50,
            status: "Preparing Tesseract analysis...",
          }));
        }
      },
    });

    return {
      text: result.data.text.trim(),
      confidence: result.data.confidence,
      engine: 'tesseract',
    };
  };

  const processImage = useCallback(async (imageSource: string | File, language: string = "eng"): Promise<OCRResult | null> => {
    setState({
      isProcessing: true,
      progress: 0,
      status: "Initializing...",
      result: null,
      error: null,
      engine: null,
    });

    try {
      let ocrResult: OCRResult | null = null;

      // Try Nanonets first (only works with File objects)
      if (imageSource instanceof File) {
        try {
          ocrResult = await processWithNanonets(imageSource);
          console.log('Nanonets OCR successful');
        } catch (nanonetsError) {
          console.warn('Nanonets failed, falling back to Tesseract:', nanonetsError);
          // Fall back to Tesseract
          ocrResult = await processWithTesseract(imageSource, language);
          console.log('Tesseract OCR successful (fallback)');
        }
      } else {
        // For string URLs, use Tesseract directly
        ocrResult = await processWithTesseract(imageSource, language);
      }

      if (ocrResult) {
        setState({
          isProcessing: false,
          progress: 100,
          status: "Complete!",
          result: ocrResult,
          error: null,
          engine: ocrResult.engine,
        });
      }

      return ocrResult;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to process image";
      setState({
        isProcessing: false,
        progress: 0,
        status: "",
        result: null,
        error: errorMessage,
        engine: null,
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
      engine: null,
    });
  }, []);

  return {
    ...state,
    processImage,
    reset,
  };
};
