import sys


def main():
    data = sys.stdin.buffer.read().split()
    n, q = int(data[0]), int(data[1])
    END = n + 1
    prv = list(range(-1, n + 1))
    nxt = list(range(1, n + 3))
    prv[0] = 0
    for i in range(q):
        x, y = int(data[2 + 2 * i]), int(data[3 + 2 * i])
        if nxt[y] == x:
            continue
        p, s = prv[x], nxt[x]
        nxt[p], prv[s] = s, p
        z = nxt[y]
        nxt[y], prv[x], nxt[x], prv[z] = x, y, z, x
    out, cur = [], nxt[0]
    while cur != END:
        out.append(cur)
        cur = nxt[cur]
    print(' '.join(map(str, out)))


main()
