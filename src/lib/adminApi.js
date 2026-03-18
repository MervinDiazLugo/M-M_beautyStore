const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

export async function adminFetch(url, options = {}) {
  const headers = {
    ...options.headers,
    'x-api-key': API_KEY,
  };
  
  return fetch(url, { ...options, headers });
}
