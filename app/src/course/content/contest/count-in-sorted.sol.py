import sys
from bisect import bisect_left, bisect_right


def main():
    data = sys.stdin.buffer.read().split()
    n = int(data[0])
    a = list(map(int, data[1:1 + n]))
    q = int(data[1 + n])
    out = []
    for x in data[2 + n:2 + n + q]:
        x = int(x)
        out.append(bisect_right(a, x) - bisect_left(a, x))
    print(' '.join(map(str, out)))


main()
