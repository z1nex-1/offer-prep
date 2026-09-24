import sys


def main():
    data = sys.stdin.buffer.read().split()
    n, t = int(data[0]), int(data[1])
    first = {}
    for j in range(n):
        x = int(data[2 + j])
        if t - x in first:
            print(first[t - x] + 1, j + 1)
            return
        if x not in first:
            first[x] = j
    print(0)


main()
