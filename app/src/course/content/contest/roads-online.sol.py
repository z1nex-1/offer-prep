import sys


def main():
    data = sys.stdin.buffer.read().split()
    n, m = int(data[0]), int(data[1])
    parent = list(range(n + 1))
    size = [1] * (n + 1)

    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x

    comps = n
    out = []
    for i in range(m):
        a, b = find(int(data[2 + 2 * i])), find(int(data[3 + 2 * i]))
        if a != b:
            if size[a] < size[b]:
                a, b = b, a
            parent[b] = a
            size[a] += size[b]
            comps -= 1
        out.append(comps)
    print('\n'.join(map(str, out)))


main()
