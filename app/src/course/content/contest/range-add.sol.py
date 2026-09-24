import sys


def main():
    data = sys.stdin.buffer.read().split()
    n, q = int(data[0]), int(data[1])
    d = [0] * (n + 2)
    pos = 2
    for _ in range(q):
        l, r, v = int(data[pos]), int(data[pos + 1]), int(data[pos + 2])
        pos += 3
        d[l] += v
        d[r + 1] -= v
    res = []
    cur = 0
    for i in range(1, n + 1):
        cur += d[i]
        res.append(cur)
    print(' '.join(map(str, res)))


main()
