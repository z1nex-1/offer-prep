import sys


def main():
    data = sys.stdin.buffer.read().split()
    n = int(data[0])
    prev = cur = best = 0
    for x in data[1:n + 1]:
        if x == b'1':
            cur += 1
        else:
            prev, cur = cur, 0
        if prev + cur > best:
            best = prev + cur
    print(best - 1 if best == n else best)


main()
