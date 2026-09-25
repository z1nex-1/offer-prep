import sys
from bisect import bisect_right


def main():
    data = sys.stdin.buffer.read().split(b'\n')
    n, q = map(int, data[0].split())
    snaps = [[] for _ in range(n)]
    vals = [[] for _ in range(n)]
    cur = 0
    out = []
    for line in data[1:q + 1]:
        p = line.split()
        if p[0] == b'SET':
            i, v = int(p[1]), int(p[2])
            if snaps[i] and snaps[i][-1] == cur:
                vals[i][-1] = v
            else:
                snaps[i].append(cur)
                vals[i].append(v)
        elif p[0] == b'SNAP':
            out.append(cur)
            cur += 1
        else:
            i, s = int(p[1]), int(p[2])
            k = bisect_right(snaps[i], s) - 1
            out.append(vals[i][k] if k >= 0 else 0)
    print('\n'.join(map(str, out)))


main()
