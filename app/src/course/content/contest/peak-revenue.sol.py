import sys


def main():
    data = sys.stdin.buffer.read().split()
    n, k = int(data[0]), int(data[1])
    ev = sorted((int(data[2 + 2 * i]), int(data[3 + 2 * i])) for i in range(n))
    best = cur = 0
    l = 0
    for t, v in ev:
        cur += v
        while ev[l][0] <= t - k:
            cur -= ev[l][1]
            l += 1
        if cur > best:
            best = cur
    print(best)


main()
