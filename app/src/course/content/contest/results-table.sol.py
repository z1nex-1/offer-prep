import sys


def main():
    data = sys.stdin.read().split()
    n = int(data[0])
    rows = [(data[1 + 3 * i], int(data[2 + 3 * i]), int(data[3 + 3 * i])) for i in range(n)]
    rows.sort(key=lambda r: (-r[1], r[2], r[0]))
    print('\n'.join(r[0] for r in rows))


main()
