import sys


def main():
    data = sys.stdin.buffer.read().split()
    n = int(data[0])
    meet = sorted(((int(data[2 + 2 * i]), int(data[1 + 2 * i])) for i in range(n)))
    count, end = 0, -1
    for e, s in meet:
        if s >= end:
            count += 1
            end = e
    print(count)


main()
