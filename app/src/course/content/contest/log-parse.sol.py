import sys


def main():
    stats = {}
    for line in sys.stdin.read().splitlines():
        line = line.strip()
        if not line:
            continue
        _, method, path, code, ms = line.split()
        key = (method, path)
        st = stats.get(key)
        if st is None:
            st = stats[key] = [0, 0, 0]
        st[0] += 1
        if 500 <= int(code) <= 599:
            st[1] += 1
        st[2] += int(ms[:-2])
    order = sorted(stats.items(), key=lambda kv: (-kv[1][0], kv[0][0] + ' ' + kv[0][1]))
    out = [f'{m} {p} {c} {e} {t // c}' for (m, p), (c, e, t) in order]
    print('\n'.join(out))


main()
