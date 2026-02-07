import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const NANONETS_API_KEY = Deno.env.get('NANONETS_API_KEY');
    const NANONETS_MODEL_ID = Deno.env.get('NANONETS_MODEL_ID');

    if (!NANONETS_API_KEY || !NANONETS_MODEL_ID) {
      return new Response(
        JSON.stringify({ error: 'Nanonets API credentials not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const formData = await req.formData();
    const imageFile = formData.get('image');

    if (!imageFile || !(imageFile instanceof File)) {
      return new Response(
        JSON.stringify({ error: 'No image file provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Send to Nanonets OCR API
    const nanonetsFormData = new FormData();
    nanonetsFormData.append('file', imageFile, imageFile.name || 'image.jpg');

    const nanonetsUrl = `https://app.nanonets.com/api/v2/OCR/Model/${NANONETS_MODEL_ID}/LabelFile/`;

    const response = await fetch(nanonetsUrl, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa(NANONETS_API_KEY + ':'),
      },
      body: nanonetsFormData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Nanonets API error:', response.status, errorText);
      return new Response(
        JSON.stringify({ error: `Nanonets API error: ${response.status}` }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();

    // Extract text from Nanonets response
    let extractedText = '';
    let confidence = 0;
    let predictionCount = 0;

    if (data.result && Array.isArray(data.result)) {
      for (const page of data.result) {
        if (page.prediction && Array.isArray(page.prediction)) {
          for (const prediction of page.prediction) {
            if (prediction.ocr_text) {
              extractedText += prediction.ocr_text + '\n';
            }
            if (typeof prediction.score === 'number') {
              confidence += prediction.score;
              predictionCount++;
            }
          }
        }
        // Also check for page-level raw_text
        if (page.page_data && page.page_data.raw_text) {
          if (!extractedText.trim()) {
            extractedText = page.page_data.raw_text;
          }
        }
      }
    }

    const avgConfidence = predictionCount > 0 ? (confidence / predictionCount) * 100 : 85;

    return new Response(
      JSON.stringify({
        text: extractedText.trim(),
        confidence: Math.round(avgConfidence * 100) / 100,
        engine: 'nanonets',
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('OCR processing error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
