import sys


def main():
    data = sys.stdin.buffer.read().split()
    n = int(data[0])
    adj = [[] for _ in range(n + 1)]
    for i in range(n - 1):
        a, b = int(data[1 + 2 * i]), int(data[2 + 2 * i])
        adj[a].append(b)
        adj[b].append(a)
    parent = [0] * (n + 1)
    depth = [0] * (n + 1)
    order = [1]
    for v in order:
        for c in adj[v]:
            if c != parent[v]:
                parent[c] = v
                depth[c] = depth[v] + 1
                order.append(c)
    size = [1] * (n + 1)
    for v in reversed(order):
        if parent[v]:
            size[parent[v]] += size[v]
    ans = [0] * (n + 1)
    ans[1] = sum(depth)
    for v in order[1:]:
        ans[v] = ans[parent[v]] + n - 2 * size[v]
    print(' '.join(map(str, ans[1:])))


main()
