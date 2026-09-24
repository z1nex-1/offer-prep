import sys


def main():
    data = sys.stdin.buffer.read().split()
    n, s = int(data[0]), int(data[1])
    a = list(map(int, data[2:2 + n]))
    best = n + 1
    l = cur = 0
    for r in range(n):
        cur += a[r]
        while cur >= s:
            best = min(best, r - l + 1)
            cur -= a[l]
            l += 1
    print(best if best <= n else 0)


main()
