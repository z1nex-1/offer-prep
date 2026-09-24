export function formatValue(v: unknown): string {
  if (v === undefined) return 'undefined'
  try {
    const s = JSON.stringify(v)
    return s.length > 400 ? s.slice(0, 400) + '…' : s
  } catch {
    return String(v)
  }
}

function normalize(v: unknown): unknown {
  if (v === undefined) return null
  return JSON.parse(JSON.stringify(v))
}

function sortKey(v: unknown) {
  return JSON.stringify(v)
}

function deepEqual(a: unknown, b: unknown, float: boolean): boolean {
  if (typeof a === 'number' && typeof b === 'number') {
    return float ? Math.abs(a - b) <= 1e-6 * Math.max(1, Math.abs(b)) : a === b
  }
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.length === b.length && a.every((x, i) => deepEqual(x, b[i], float))
  }
  if (a && b && typeof a === 'object' && typeof b === 'object') {
    const ka = Object.keys(a as object).sort()
    const kb = Object.keys(b as object).sort()
    return (
      ka.length === kb.length &&
      ka.every((k, i) => k === kb[i] && deepEqual((a as Record<string, unknown>)[k], (b as Record<string, unknown>)[k], float))
    )
  }
  return a === b
}

export function compare(got: unknown, expected: unknown, mode = 'exact'): boolean {
  let g = normalize(got)
  let e = normalize(expected)
  if (mode === 'unordered' && Array.isArray(g) && Array.isArray(e)) {
    g = [...g].sort((x, y) => (sortKey(x) < sortKey(y) ? -1 : 1))
    e = [...e].sort((x, y) => (sortKey(x) < sortKey(y) ? -1 : 1))
  }
  if (mode === 'unordered-nested' && Array.isArray(g) && Array.isArray(e)) {
    const inner = (arr: unknown[]) =>
      arr
        .map((x) => (Array.isArray(x) ? [...x].sort((p, q) => (sortKey(p) < sortKey(q) ? -1 : 1)) : x))
        .sort((x, y) => (sortKey(x) < sortKey(y) ? -1 : 1))
    g = inner(g)
    e = inner(e)
  }
  return deepEqual(g, e, mode === 'float')
}
