export function resolveAssetPath(path: string) {
    if (path.startsWith('http') || path.startsWith('//')) return path
    const base = import.meta.env.DEV ? '/' : import.meta.env.BASE_URL ?? '/'
    if (path.startsWith(base)) return path
    return `${base.replace(/\/$/, '')}${path.startsWith('/') ? '' : '/'}${path}`
}