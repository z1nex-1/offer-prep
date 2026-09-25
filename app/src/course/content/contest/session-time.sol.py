import sys


def sec(t):
    h, m, s = t.split(':')
    return int(h) * 3600 + int(m) * 60 + int(s)


def main():
    data = sys.stdin.read().split()
    n = int(data[0])
    total = 0
    best, best_i = -1, 0
    for i in range(n):
        d = (sec(data[2 + 2 * i]) - sec(data[1 + 2 * i])) % 86400
        total += d
        if d > best:
            best, best_i = d, i + 1
    h, rest = divmod(total, 3600)
    m, s = divmod(rest, 60)
    print(f"{h}:{m:02d}:{s:02d}")
    print(best_i)


main()
