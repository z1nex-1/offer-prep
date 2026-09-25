import sys


def ones(n):
    m = n + 1
    total = 0
    b = 0
    while (1 << b) <= n:
        period = 1 << (b + 1)
        total += m // period * (1 << b) + max(0, m % period - (1 << b))
        b += 1
    return total


def main():
    data = sys.stdin.buffer.read().split()
    t = int(data[0])
    print('\n'.join(str(ones(int(x))) for x in data[1:1 + t]))


main()
