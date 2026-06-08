export const env = {
  turnstileSiteKey: import.meta.env.VITE_TURNSTILE_SITE_KEY ?? '',
}

if (!env.turnstileSiteKey) {
  throw new Error('Missing VITE_TURNSTILE_SITE_KEY')
}
