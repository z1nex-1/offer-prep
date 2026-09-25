import sys


def main():
    data = sys.stdin.buffer.read().split()
    n = int(data[0])
    g = [[] for _ in range(n + 1)]
    for i in range(n - 1):
        u, v, w = int(data[1 + 3 * i]), int(data[2 + 3 * i]), int(data[3 + 3 * i])
        g[u].append((v, w))
        g[v].append((u, w))

    def farthest(s):
        dist = [-1] * (n + 1)
        dist[s] = 0
        stack = [s]
        while stack:
            v = stack.pop()
            for u, w in g[v]:
                if dist[u] < 0:
                    dist[u] = dist[v] + w
                    stack.append(u)
        far = max(range(1, n + 1), key=lambda v: dist[v])
        return far, dist[far]

    a, _ = farthest(1)
    _, d = farthest(a)
    print(d)


main()
