import sys


def main():
    data = sys.stdin.buffer.read().split()
    n, x = int(data[0]), int(data[1])
    a = sorted(map(int, data[2:2 + n]))
    l, r = 0, n - 1
    best = None
    while l < r:
        s = a[l] + a[r]
        if best is None or (abs(s - x), s) < (abs(best - x), best):
            best = s
        if s == x:
            break
        if s < x:
            l += 1
        else:
            r -= 1
    print(best)


main()
