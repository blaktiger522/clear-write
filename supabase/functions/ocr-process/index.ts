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

    const responseText = await response.text();
    console.log('Nanonets raw response:', responseText.substring(0, 2000));

    let data: any;
    try {
      data = JSON.parse(responseText);
    } catch {
      // Response is plain text (e.g., markdown)
      return new Response(
        JSON.stringify({
          text: responseText.trim(),
          confidence: 95,
          engine: 'nanonets',
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Nanonets parsed response keys:', Object.keys(data));

    // Extract text from the response - check all known fields
    let extractedText = '';
    let confidence = 90;

    if (data.markdown) {
      extractedText = data.markdown;
    } else if (data.raw_text) {
      extractedText = data.raw_text;
    } else if (data.text) {
      extractedText = data.text;
    } else if (typeof data.result === 'string') {
      extractedText = data.result;
    } else if (Array.isArray(data.result)) {
      extractedText = data.result.map((r: any) => {
        console.log('Result item keys:', Object.keys(r));
        return r.raw_text || r.text || r.ocr_text || r.page_data || '';
      }).join('\n');
    } else if (data.results && Array.isArray(data.results)) {
      extractedText = data.results.map((r: any) => {
        console.log('Results item keys:', Object.keys(r));
        return r.raw_text || r.text || r.ocr_text || r.page_data || '';
      }).join('\n');
    } else if (data.data) {
      // Some APIs nest under 'data'
      if (typeof data.data === 'string') {
        extractedText = data.data;
      } else if (Array.isArray(data.data)) {
        extractedText = data.data.map((d: any) => d.raw_text || d.text || d.ocr_text || '').join('\n');
      }
    }

    // If still empty, log full structure and stringify
    if (!extractedText) {
      console.log('Full Nanonets response structure:', JSON.stringify(data).substring(0, 3000));
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
