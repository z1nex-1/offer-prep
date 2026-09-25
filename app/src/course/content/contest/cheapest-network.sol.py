import sys


def main():
    data = sys.stdin.buffer.read().split()
    n, m = int(data[0]), int(data[1])
    edges = sorted((int(data[4 + 3 * i]), int(data[2 + 3 * i]), int(data[3 + 3 * i])) for i in range(m))
    parent = list(range(n + 1))

    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x

    total = taken = 0
    for w, u, v in edges:
        a, b = find(u), find(v)
        if a != b:
            parent[a] = b
            total += w
            taken += 1
            if taken == n - 1:
                break
    print(total if taken == n - 1 else -1)


main()
