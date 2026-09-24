import { execFileSync } from 'node:child_process'
import { writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { datasets, sqlTasks } from '../src/data/sql.ts'

const p = join(tmpdir(), 'offer-sql.json')
writeFileSync(p, JSON.stringify({ datasets, sqlTasks }))
const py = `
import json, sqlite3, sys
d = json.load(open(sys.argv[1]))
ds = {x["id"]: x["sql"] for x in d["datasets"]}
ids = set()
for t in d["sqlTasks"]:
    if t["id"] in ids: print("DUP", t["id"])
    ids.add(t["id"])
    con = sqlite3.connect(":memory:")
    con.executescript(ds[t["dataset"]])
    try:
        cur = con.execute(t["solution"])
        cols = [c[0] for c in cur.description]
        rows = cur.fetchall()
        print(f"== {t['id']} ({len(rows)} rows) {cols}")
        for r in rows[:12]: print("   ", r)
    except Exception as e:
        print("ERR", t["id"], e)
print("sqlite", sqlite3.sqlite_version, "tasks", len(d["sqlTasks"]))
`
writeFileSync(join(tmpdir(), 'offer-sql.py'), py)
console.log(execFileSync('python3', [join(tmpdir(), 'offer-sql.py'), p]).toString())
