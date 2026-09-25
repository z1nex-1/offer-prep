import sys


def main():
    data = sys.stdin.buffer.read().split()
    n = int(data[0])
    xs = list(map(int, data[1:2 * n + 1:2]))
    ys = list(map(int, data[2:2 * n + 2:2]))
    d = 0
    for i in range(n):
        j = i + 1 if i + 1 < n else 0
        d += xs[i] * ys[j] - xs[j] * ys[i]
    d = abs(d)
    print(f"{d // 2}.{5 if d % 2 else 0}")


main()
