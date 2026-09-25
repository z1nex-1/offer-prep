import sys


def main():
    data = sys.stdin.buffer.read().split()
    n = int(data[0])
    children = [[] for _ in range(n + 1)]
    is_parent = [False] * (n + 1)
    for i in range(2, n + 1):
        p = int(data[i - 1])
        children[p].append(i)
        is_parent[p] = True
    depth = [0] * (n + 1)
    order = [1]
    for v in order:
        for c in children[v]:
            depth[c] = depth[v] + 1
            order.append(c)
    leaves = sum(1 for v in range(1, n + 1) if not is_parent[v])
    print(max(depth[1:]), leaves)


main()
