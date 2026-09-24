import sys
from bisect import bisect_left


def main():
    data = sys.stdin.buffer.read().split()
    n, q = int(data[0]), int(data[1])
    a = list(map(int, data[2:2 + n]))
    out = []
    for x in data[2 + n:2 + n + q]:
        x = int(x)
        i = bisect_left(a, x)
        cand = [a[j] for j in (i - 1, i) if 0 <= j < n]
        out.append(min(cand, key=lambda v: (abs(v - x), v)))
    print('\n'.join(map(str, out)))


main()
