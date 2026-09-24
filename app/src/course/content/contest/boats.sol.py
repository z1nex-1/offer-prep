import sys


def main():
    data = sys.stdin.buffer.read().split()
    n, lim = int(data[0]), int(data[1])
    w = sorted(map(int, data[2:2 + n]))
    l, r = 0, n - 1
    boats = 0
    while l <= r:
        if l < r and w[l] + w[r] <= lim:
            l += 1
        r -= 1
        boats += 1
    print(boats)


main()
