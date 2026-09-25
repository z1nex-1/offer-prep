import sys

MISSING = object()


def main():
    store, cnt, tx, out = {}, {}, [], []

    def assign(k, v):
        old = store.get(k, MISSING)
        if old is not MISSING:
            cnt[old] -= 1
            del store[k]
        if v is not MISSING:
            store[k] = v
            cnt[v] = cnt.get(v, 0) + 1
        return old

    for line in sys.stdin.read().splitlines():
        p = line.split()
        if not p:
            continue
        c = p[0]
        if c == 'SET' or c == 'UNSET':
            v = p[2] if c == 'SET' else MISSING
            old = assign(p[1], v)
            if tx:
                tx[-1].append((p[1], old))
        elif c == 'GET':
            out.append(store.get(p[1], 'NULL'))
        elif c == 'COUNT':
            out.append(str(cnt.get(p[1], 0)))
        elif c == 'BEGIN':
            tx.append([])
        elif c == 'ROLLBACK':
            if not tx:
                out.append('NO TRANSACTION')
            else:
                for k, old in reversed(tx.pop()):
                    assign(k, old)
        elif c == 'COMMIT':
            if not tx:
                out.append('NO TRANSACTION')
            else:
                tx.clear()
    print('\n'.join(out))


main()
