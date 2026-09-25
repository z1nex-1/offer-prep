import sys
from bisect import bisect_right


def main():
    data = sys.stdin.read().split('\n')
    q = int(data[0])
    times, vals = {}, {}
    out = []
    for line in data[1:q + 1]:
        p = line.split()
        if p[0] == 'SET':
            times.setdefault(p[1], []).append(int(p[3]))
            vals.setdefault(p[1], []).append(p[2])
        else:
            ts = times.get(p[1])
            i = bisect_right(ts, int(p[2])) - 1 if ts else -1
            out.append(vals[p[1]][i] if i >= 0 else 'NONE')
    print('\n'.join(out))


main()
