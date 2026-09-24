import sys


def main():
    data = sys.stdin.buffer.read().split()
    n = int(data[0])
    best, low = 0, 10 ** 18
    for x in data[1:n + 1]:
        p = int(x)
        if p < low:
            low = p
        elif p - low > best:
            best = p - low
    print(best)


main()
