import sys


def main():
    data = sys.stdin.buffer.read().split()
    n = int(data[0])
    parent = [0, 1] + [int(x) for x in data[1:n]]
    children = [[] for _ in range(n + 1)]
    for v in range(2, n + 1):
        children[parent[v]].append(v)
    depth = [0] * (n + 1)
    order = [1]
    for v in order:
        for c in children[v]:
            depth[c] = depth[v] + 1
            order.append(c)
    LOG = max(1, n.bit_length())
    up = [parent]
    for _ in range(1, LOG):
        prev = up[-1]
        up.append([prev[prev[v]] for v in range(n + 1)])
    q = int(data[n])
    out = []
    pos = n + 1
    for _ in range(q):
        u, v = int(data[pos]), int(data[pos + 1])
        pos += 2
        du, dv = depth[u], depth[v]
        a, b = (u, v) if du >= dv else (v, u)
        diff = abs(du - dv)
        k = 0
        while diff:
            if diff & 1:
                a = up[k][a]
            diff >>= 1
            k += 1
        if a != b:
            for k in range(LOG - 1, -1, -1):
                row = up[k]
                if row[a] != row[b]:
                    a = row[a]
                    b = row[b]
            a = parent[a]
        out.append(du + dv - 2 * depth[a])
    print("\n".join(map(str, out)))


main()
