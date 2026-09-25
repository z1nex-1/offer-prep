import sys


def main():
    data = sys.stdin.buffer.read().split()
    n, q = int(data[0]), int(data[1])
    left = list(range(-1, n + 1))
    right = list(range(1, n + 3))
    out = []
    for i in range(q):
        x = int(data[2 + i])
        l, r = left[x], right[x]
        right[l], left[r] = r, l
        out.append(f'{l} {r if r <= n else 0}')
    sys.stdout.write('\n'.join(out) + '\n')


main()
