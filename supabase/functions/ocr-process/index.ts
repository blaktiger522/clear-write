import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface OCRResponse {
  text: string;
  confidence: number;
  engine: 'nanonets' | 'tesseract';
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const NANONETS_API_KEY = Deno.env.get('NANONETS_API_KEY');
    const NANONETS_MODEL_ID = Deno.env.get('NANONETS_MODEL_ID');

    if (!NANONETS_API_KEY || !NANONETS_MODEL_ID) {
      console.error('Missing Nanonets configuration');
      return new Response(
        JSON.stringify({ 
          error: 'OCR service not configured',
          fallback: true 
        }),
        { 
          status: 503, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const { imageBase64, fileName } = await req.json();

    if (!imageBase64) {
      return new Response(
        JSON.stringify({ error: 'No image provided' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Remove data URL prefix if present
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
    
    // Convert base64 to binary
    const binaryData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));

    // Create form data for Nanonets API
    const formData = new FormData();
    const blob = new Blob([binaryData], { type: 'image/jpeg' });
    formData.append('file', blob, fileName || 'image.jpg');

    // Call Nanonets OCR API
    const nanonetsUrl = `https://app.nanonets.com/api/v2/OCR/Model/${NANONETS_MODEL_ID}/LabelFile/`;
    
    console.log('Calling Nanonets OCR API...');
    
    const response = await fetch(nanonetsUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(NANONETS_API_KEY + ':')}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Nanonets API error:', response.status, errorText);
      return new Response(
        JSON.stringify({ 
          error: 'OCR processing failed',
          fallback: true,
          details: `Nanonets API returned ${response.status}`
        }),
        { 
          status: 502, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const result = await response.json();
    console.log('Nanonets response received');

    // Extract text from Nanonets response
    let extractedText = '';
    let totalConfidence = 0;
    let predictionCount = 0;

    if (result.result && result.result.length > 0) {
      const pageResult = result.result[0];
      
      // Check for raw_text first (full page OCR)
      if (pageResult.page_data && pageResult.page_data.raw_text) {
        extractedText = pageResult.page_data.raw_text;
        totalConfidence = 85; // Default confidence for raw text
        predictionCount = 1;
      } 
      // Then check for prediction array
      else if (pageResult.prediction && pageResult.prediction.length > 0) {
        const textParts: string[] = [];
        
        for (const pred of pageResult.prediction) {
          if (pred.ocr_text) {
            textParts.push(pred.ocr_text);
            if (pred.score) {
              totalConfidence += pred.score * 100;
              predictionCount++;
            }
          }
        }
        
        extractedText = textParts.join('\n');
      }
    }

    const avgConfidence = predictionCount > 0 
      ? totalConfidence / predictionCount 
      : 0;

    const ocrResponse: OCRResponse = {
      text: extractedText.trim(),
      confidence: avgConfidence,
      engine: 'nanonets',
    };

    console.log('OCR completed successfully with Nanonets');

    return new Response(
      JSON.stringify(ocrResponse),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('OCR processing error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        fallback: true 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
