import sys


def main():
    data = sys.stdin.buffer.read().split()
    n, q = int(data[0]), int(data[1])
    a = [0] + [int(x) for x in data[2:2 + n]]
    t = a[:]
    for i in range(1, n + 1):
        j = i + (i & -i)
        if j <= n:
            t[j] += t[i]
    out = []
    pos = 2 + n
    for _ in range(q):
        kind, u, v = data[pos], int(data[pos + 1]), int(data[pos + 2])
        pos += 3
        if kind == b'1':
            delta = v - a[u]
            a[u] = v
            while u <= n:
                t[u] += delta
                u += u & -u
        else:
            s = 0
            while v > 0:
                s += t[v]
                v -= v & -v
            u -= 1
            while u > 0:
                s -= t[u]
                u -= u & -u
            out.append(s)
    print("\n".join(map(str, out)))


main()
