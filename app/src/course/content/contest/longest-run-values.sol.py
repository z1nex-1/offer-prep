import sys


def main():
    data = sys.stdin.buffer.read().split()
    n = int(data[0])
    s = set(map(int, data[1:n + 1]))
    best = 0
    for x in s:
        if x - 1 not in s:
            y = x
            while y + 1 in s:
                y += 1
            best = max(best, y - x + 1)
    print(best)


main()
