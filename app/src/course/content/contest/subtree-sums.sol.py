import sys


def main():
    data = sys.stdin.buffer.read().split()
    n = int(data[0])
    a = [0] + [int(x) for x in data[1:n + 1]]
    g = [[] for _ in range(n + 1)]
    pos = n + 1
    for _ in range(n - 1):
        u, v = int(data[pos]), int(data[pos + 1])
        pos += 2
        g[u].append(v)
        g[v].append(u)
    parent = [0] * (n + 1)
    parent[1] = -1
    order = [1]
    for v in order:
        for u in g[v]:
            if u != parent[v]:
                parent[u] = v
                order.append(u)
    res = a[:]
    for v in reversed(order):
        if parent[v] > 0:
            res[parent[v]] += res[v]
    print(" ".join(map(str, res[1:])))


main()
