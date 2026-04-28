export function isGeminiConfigured() {
  const key = process.env.REACT_APP_GEMINI_KEY;
  return key && key !== 'your_gemini_api_key_here';
}

export async function callGemini(prompt) {
  const key = process.env.REACT_APP_GEMINI_KEY;
  
  if (!key || key === 'your_gemini_api_key_here') {
    console.warn('⚠️ Gemini API key not configured');
    return null;
  }

  // Using FREE models: gemini-2.5-flash (recommended, fastest)
  // Alternative free models: gemini-2.5-flash-lite, gemini-2.5-pro (limited)
  const MODEL = 'gemini-2.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${key}`;
  
  try {
    console.log(`📤 Calling Gemini API (${MODEL}) - FREE tier...`);
    
    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: prompt
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024
      }
    };

    console.log('📋 Request format validated ✓');
    
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });
    
    // Enhanced error handling
    if (!res.ok) {
      const errorText = await res.text();
      console.error(`❌ Gemini API Error: ${res.status} ${res.statusText}`);
      console.error(`📍 Endpoint: ${url}`);
      console.error(`📝 Response: ${errorText}`);
      
      if (res.status === 404) {
        console.error('🔴 404 Not Found - Possible causes:');
        console.error('   • Model gemini-2.5-flash not available in your region');
        console.error('   • Try alternative: gemini-2.5-flash-lite or gemini-1.5-flash');
        console.error('   • API might not be enabled in Google Cloud');
      } else if (res.status === 403) {
        console.error('🔴 403 Forbidden - API key might be invalid or disabled');
      } else if (res.status === 400) {
        console.error('🔴 400 Bad Request - Request format issue');
      }
      return null;
    }
    
    const data = await res.json();
    
    if (!data.candidates || data.candidates.length === 0) {
      console.error('❌ No candidates in response');
      return null;
    }
    
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!responseText) {
      console.error('❌ No text in response');
      return null;
    }
    
    console.log('✅ Gemini API call successful');
    return responseText;
    
  } catch (e) {
    console.error('❌ Gemini API fetch error:', e.message);
    console.error('🔍 Error details:', e);
    return null;
  }
}
