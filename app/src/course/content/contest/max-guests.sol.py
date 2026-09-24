import sys


def main():
    data = sys.stdin.buffer.read().split()
    n = int(data[0])
    ev = []
    for i in range(n):
        ev.append((int(data[1 + 2 * i]), 1))
        ev.append((int(data[2 + 2 * i]), -1))
    ev.sort()
    cur = best = 0
    for _, d in ev:
        cur += d
        if cur > best:
            best = cur
    print(best)


main()
