import sys


def main():
    data = sys.stdin.buffer.read().split()
    n, k = int(data[0]), int(data[1])
    a = list(map(int, data[2:2 + n]))
    cur = sum(a[:k])
    best = cur
    for i in range(k, n):
        cur += a[i] - a[i - k]
        if cur > best:
            best = cur
    print(best)


main()
