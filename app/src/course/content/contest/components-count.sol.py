import sys


def main():
    data = sys.stdin.buffer.read().split()
    n, m = int(data[0]), int(data[1])
    g = [[] for _ in range(n + 1)]
    for i in range(m):
        u, v = int(data[2 + 2 * i]), int(data[3 + 2 * i])
        g[u].append(v)
        g[v].append(u)
    seen = [False] * (n + 1)
    comps = best = 0
    for s in range(1, n + 1):
        if seen[s]:
            continue
        comps += 1
        seen[s] = True
        stack = [s]
        size = 0
        while stack:
            u = stack.pop()
            size += 1
            for v in g[u]:
                if not seen[v]:
                    seen[v] = True
                    stack.append(v)
        best = max(best, size)
    print(comps, best)


main()
