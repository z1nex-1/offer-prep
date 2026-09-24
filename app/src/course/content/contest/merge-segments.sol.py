import sys


def main():
    data = sys.stdin.buffer.read().split()
    n = int(data[0])
    segs = sorted((int(data[1 + 2 * i]), int(data[2 + 2 * i])) for i in range(n))
    res = []
    for l, r in segs:
        if res and l <= res[-1][1]:
            if r > res[-1][1]:
                res[-1][1] = r
        else:
            res.append([l, r])
    out = [str(len(res))] + [f'{l} {r}' for l, r in res]
    print('\n'.join(out))


main()
