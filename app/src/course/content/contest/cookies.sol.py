import sys


def main():
    data = sys.stdin.buffer.read().split()
    n, m = int(data[0]), int(data[1])
    g = sorted(map(int, data[2:2 + n]))
    s = sorted(map(int, data[2 + n:2 + n + m]))
    i = 0
    for size in s:
        if i < n and size >= g[i]:
            i += 1
    print(i)


main()
