import sys
from bisect import bisect_left, bisect_right


def main():
    data = sys.stdin.buffer.read().split()
    n, m = int(data[0]), int(data[1])
    L, R = [], []
    for i in range(n):
        a, b = int(data[2 + 2 * i]), int(data[3 + 2 * i])
        if a > b:
            a, b = b, a
        L.append(a)
        R.append(b)
    L.sort()
    R.sort()
    pts = data[2 + 2 * n:2 + 2 * n + m]
    print(' '.join(str(bisect_right(L, int(x)) - bisect_left(R, int(x))) for x in pts))


main()
