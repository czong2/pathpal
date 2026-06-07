export const env = {
  apiUrl: import.meta.env.VITE_API_URL ?? '',
  turnstileSiteKey: import.meta.env.VITE_TURNSTILE_SITE_KEY ?? '',
}

if (!env.turnstileSiteKey) {
  throw new Error('Missing VITE_TURNSTILE_SITE_KEY')
}
