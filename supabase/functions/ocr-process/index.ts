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

    if (!NANONETS_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'Nanonets API key not configured' }),
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

    // Build request for Nanonets Extraction API
    const nanonetsFormData = new FormData();
    nanonetsFormData.append('file', imageFile, imageFile.name || 'image.jpg');
    nanonetsFormData.append('output_format', 'markdown');

    const response = await fetch('https://extraction-api.nanonets.com/api/v1/extract/sync', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NANONETS_API_KEY}`,
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

    // Extract text from the response
    let extractedText = '';
    let confidence = 90; // Default high confidence for Nanonets

    if (typeof data === 'string') {
      extractedText = data;
    } else if (data.result) {
      // Handle various response formats
      if (typeof data.result === 'string') {
        extractedText = data.result;
      } else if (Array.isArray(data.result)) {
        extractedText = data.result.map((r: any) => r.text || r.raw_text || r.ocr_text || '').join('\n');
      }
    } else if (data.text) {
      extractedText = data.text;
    } else if (data.raw_text) {
      extractedText = data.raw_text;
    } else if (data.markdown) {
      extractedText = data.markdown;
    } else {
      // Try to extract any text content from the response
      extractedText = JSON.stringify(data);
    }

    if (data.confidence) {
      confidence = typeof data.confidence === 'number' ? data.confidence * 100 : parseFloat(data.confidence);
    }

    return new Response(
      JSON.stringify({
        text: extractedText.trim(),
        confidence: Math.round(confidence * 100) / 100,
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
