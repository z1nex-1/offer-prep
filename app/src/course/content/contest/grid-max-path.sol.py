import sys


def main():
    data = sys.stdin.buffer.read().split()
    n, m = int(data[0]), int(data[1])
    a = [list(map(int, data[2 + i * m:2 + (i + 1) * m])) for i in range(n)]
    NEG = float('-inf')
    best = [[NEG] * (m + 1) for _ in range(n + 1)]
    for i in range(n - 1, -1, -1):
        for j in range(m - 1, -1, -1):
            if i == n - 1 and j == m - 1:
                best[i][j] = a[i][j]
            else:
                best[i][j] = a[i][j] + max(best[i + 1][j], best[i][j + 1])
    path = []
    i = j = 0
    while (i, j) != (n - 1, m - 1):
        if i + 1 < n and best[i + 1][j] >= best[i][j + 1]:
            path.append('D')
            i += 1
        else:
            path.append('R')
            j += 1
    print(best[0][0])
    print(''.join(path))


main()
