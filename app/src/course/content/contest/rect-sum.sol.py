import sys


def main():
    data = sys.stdin.buffer.read().split()
    n, m, q = int(data[0]), int(data[1]), int(data[2])
    pos = 3
    P = [[0] * (m + 1) for _ in range(n + 1)]
    for i in range(1, n + 1):
        row, prev = P[i], P[i - 1]
        s = 0
        for j in range(1, m + 1):
            s += int(data[pos])
            pos += 1
            row[j] = prev[j] + s
    out = []
    for _ in range(q):
        x1, y1, x2, y2 = (int(v) for v in data[pos:pos + 4])
        pos += 4
        out.append(P[x2][y2] - P[x1 - 1][y2] - P[x2][y1 - 1] + P[x1 - 1][y1 - 1])
    print('\n'.join(map(str, out)))


main()
