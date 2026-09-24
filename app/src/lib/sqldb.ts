import initSqlJs, { type Database, type SqlJsStatic } from 'sql.js'
import wasmUrl from 'sql.js/dist/sql-wasm.wasm?url'
import { datasets } from '../data/sql'

let SQL: Promise<SqlJsStatic> | null = null
const cache = new Map<string, Database>()

function engine() {
  if (!SQL) SQL = initSqlJs({ locateFile: () => wasmUrl })
  return SQL
}

export async function freshDb(datasetId: string): Promise<Database> {
  const S = await engine()
  const ds = datasets.find((d) => d.id === datasetId)
  if (!ds) throw new Error(`Нет набора данных ${datasetId}`)
  const db = new S.Database()
  db.run(ds.sql)
  return db
}

export async function getDb(datasetId: string): Promise<Database> {
  const hit = cache.get(datasetId)
  if (hit) return hit
  const db = await freshDb(datasetId)
  cache.set(datasetId, db)
  return db
}

export interface QueryResult {
  columns: string[]
  values: unknown[][]
}

export async function runQuery(datasetId: string, query: string): Promise<QueryResult> {
  const db = await freshDb(datasetId)
  try {
    const res = db.exec(query)
    const last = res[res.length - 1]
    return last ? { columns: last.columns, values: last.values } : { columns: [], values: [] }
  } finally {
    db.close()
  }
}

export async function schemaOf(datasetId: string) {
  const db = await getDb(datasetId)
  const tables = db.exec("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name")[0]?.values.map((v) => String(v[0])) ?? []
  return tables.map((name) => {
    const cols = db.exec(`PRAGMA table_info(${name})`)[0]?.values.map((v) => ({ name: String(v[1]), type: String(v[2]) })) ?? []
    const sample = db.exec(`SELECT * FROM ${name} LIMIT 5`)[0]
    const count = Number(db.exec(`SELECT COUNT(*) FROM ${name}`)[0]?.values[0][0] ?? 0)
    return { name, cols, sample: sample ? { columns: sample.columns, values: sample.values } : { columns: [], values: [] }, count }
  })
}

function norm(v: unknown) {
  if (typeof v === 'number') return Math.round(v * 1e4) / 1e4
  return v
}

export function sameResult(a: QueryResult, b: QueryResult, ordered: boolean): { ok: boolean; reason?: string } {
  if (a.columns.length !== b.columns.length) return { ok: false, reason: `Ожидалось столбцов: ${b.columns.length}, получено: ${a.columns.length}` }
  if (a.values.length !== b.values.length) return { ok: false, reason: `Ожидалось строк: ${b.values.length}, получено: ${a.values.length}` }
  const rows = (r: QueryResult) => r.values.map((row) => JSON.stringify(row.map(norm)))
  const ra = rows(a)
  const rb = rows(b)
  if (!ordered) {
    ra.sort()
    rb.sort()
  }
  for (let i = 0; i < ra.length; i++) {
    if (ra[i] !== rb[i]) return { ok: false, reason: ordered ? `Строка ${i + 1} отличается (проверьте ORDER BY и значения)` : 'Значения в строках отличаются' }
  }
  return { ok: true }
}
