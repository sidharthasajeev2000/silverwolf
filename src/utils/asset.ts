export function asset(path: string) {
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`
}

export function routerBasename() {
  if (typeof window === 'undefined') return undefined
  return window.location.hostname === 'sidharthasajeev2000.github.io'
    ? '/silverwolf'
    : undefined
}
