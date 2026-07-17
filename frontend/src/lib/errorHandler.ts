/**
 * Converts any API/network error into a clear, human-friendly message.
 * Shows exactly what went wrong: network, API key, AI model, server, etc.
 */
export function getErrorMessage(err: any): string {
  // --- No internet / network down ---
  if (!navigator.onLine) {
    return '🌐 No internet connection. Please check your Wi-Fi or mobile data and try again.';
  }

  // --- Request timed out (server sleeping) ---
  if (err?.code === 'ECONNABORTED' || err?.message?.includes('timeout')) {
    return '⏱️ Request timed out. The AI server may be waking up from sleep — please wait 30 seconds and try again.';
  }

  // --- Network error (server completely unreachable) ---
  if (err?.message === 'Network Error' || err?.code === 'ERR_NETWORK') {
    return '🔌 Cannot reach the server. The backend may be offline or still starting up. Please wait 1 minute and try again.';
  }

  // Try to get the server's response body
  const serverMsg: string =
    err?.response?.data?.message ||
    err?.response?.data?.error ||
    err?.response?.data ||
    err?.message ||
    '';

  const status: number = err?.response?.status;

  // --- HTTP status code based errors ---
  switch (status) {
    case 400:
      return `❌ Bad request: ${serverMsg || 'The data you sent was invalid. Please check your input.'}`;
    case 401:
      return '🔐 You are not logged in or your session expired. Please log out and sign in again.';
    case 402:
      return '💳 Not enough AI credits or Rate Limit reached. Please check your Groq API limits.';
    case 403:
      return '🚫 Access denied. You do not have permission to perform this action.';
    case 404:
      return '🤖 AI Model not found. The model name is wrong. Update GROQ_MODEL on Render to: llama-3.3-70b-versatile';
    case 429:
      return '🐢 Too many requests. You are sending requests too fast. Please wait 30 seconds and try again.';
    case 500:
      return `🔥 Server error: ${serverMsg || 'The AI server crashed. Please try again in a few moments.'}`;
    case 502:
    case 503:
    case 504:
      return '🛑 The AI server is temporarily down or overloaded. Please try again in 1-2 minutes.';
  }

  // --- AI model specific errors in the message ---
  if (typeof serverMsg === 'string') {
    const lower = serverMsg.toLowerCase();

    if (lower.includes('api key') || lower.includes('invalid key') || lower.includes('unauthorized') || lower.includes('groq_api_key')) {
      return '🔑 Invalid API Key. The AI service rejected the key. Please check GROQ_API_KEY on Render.';
    }
    if (lower.includes('credit') || lower.includes('afford') || lower.includes('billing') || lower.includes('quota')) {
      return '💳 AI quota/credits issue. Please check your Groq account limits.';
    }
    if (lower.includes('model') && lower.includes('not found')) {
      return '🤖 AI Model not found. Backend must use a supported Groq model. Redeploy the backend on Render.';
    }
    if (lower.includes('empty response') || lower.includes('incomplete') || lower.includes('could not parse')) {
      return `⚠️ ${serverMsg}`;
    }
    if (lower.includes('rate limit') || lower.includes('too many')) {
      return '🐢 Rate limited by the AI provider. Please wait 30 seconds and try again.';
    }
    if (lower.includes('timeout') || lower.includes('timed out')) {
      return '⏱️ The AI took too long to respond. Please try again.';
    }
    if (lower.includes('content') && (lower.includes('block') || lower.includes('filter') || lower.includes('policy'))) {
      return '🚨 The AI blocked this request due to content policy. Please rephrase your input.';
    }
    if (serverMsg.length > 0 && serverMsg.length < 300) {
      return `⚠️ AI Error: ${serverMsg}`;
    }
  }

  // --- Generic fallback ---
  return '❓ Something went wrong. Please refresh the page and try again. If the problem persists, the AI server may be restarting.';
}
