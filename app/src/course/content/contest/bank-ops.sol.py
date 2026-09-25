import sys


def main():
    bal = {}
    out = []
    for line in sys.stdin.read().splitlines():
        p = line.split()
        if not p:
            continue
        c = p[0]
        if c == 'DEPOSIT':
            bal[p[1]] = bal.get(p[1], 0) + int(p[2])
        elif c == 'WITHDRAW':
            s = int(p[2])
            if p[1] in bal and bal[p[1]] >= s:
                bal[p[1]] -= s
                out.append('OK')
            else:
                out.append('ERROR')
        elif c == 'BALANCE':
            out.append(str(bal[p[1]]) if p[1] in bal else 'ERROR')
        elif c == 'TRANSFER':
            a, b, s = p[1], p[2], int(p[3])
            if a in bal and bal[a] >= s:
                bal[a] -= s
                bal[b] = bal.get(b, 0) + s
                out.append('OK')
            else:
                out.append('ERROR')
        elif c == 'INCOME':
            pct = int(p[1])
            for k, v in bal.items():
                if v > 0:
                    bal[k] = v + v * pct // 100
    print('\n'.join(out))


main()
