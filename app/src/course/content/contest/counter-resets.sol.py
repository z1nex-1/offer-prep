import sys


def main():
    data = sys.stdin.buffer.read().split()
    n, k = int(data[0]), int(data[1])
    c = list(map(int, data[2:2 + n]))
    inc = [c[0]] + [c[i] - c[i - 1] if c[i] >= c[i - 1] else c[i] for i in range(1, n)]
    cur = sum(inc[:k])
    best = cur
    for i in range(k, n):
        cur += inc[i] - inc[i - k]
        if cur > best:
            best = cur
    print(best)


main()
