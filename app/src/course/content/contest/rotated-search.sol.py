import sys
from bisect import bisect_left


def main():
    data = sys.stdin.buffer.read().split()
    n, q = int(data[0]), int(data[1])
    a = list(map(int, data[2:2 + n]))
    lo, hi = 0, n - 1
    while lo < hi:
        mid = (lo + hi) // 2
        if a[mid] <= a[-1]:
            hi = mid
        else:
            lo = mid + 1
    k = lo
    b = a[k:] + a[:k]
    out = []
    for x in data[2 + n:2 + n + q]:
        x = int(x)
        i = bisect_left(b, x)
        out.append((i + k) % n + 1 if i < n and b[i] == x else -1)
    print(' '.join(map(str, out)))


main()
