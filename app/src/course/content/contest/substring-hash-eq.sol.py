import sys
import random


def main():
    data = sys.stdin.buffer.read().split()
    s = data[0]
    n = len(s)
    q = int(data[1])
    M = (1 << 61) - 1
    P = random.randrange(10 ** 6, M - 1)
    h = [0] * (n + 1)
    pw = [1] * (n + 1)
    for i in range(n):
        h[i + 1] = (h[i] * P + s[i]) % M
        pw[i + 1] = pw[i] * P % M
    out = []
    idx = 2
    for _ in range(q):
        l1, r1, l2, r2 = int(data[idx]) - 1, int(data[idx + 1]), int(data[idx + 2]) - 1, int(data[idx + 3])
        idx += 4
        a = (h[r1] - h[l1] * pw[r1 - l1]) % M
        b = (h[r2] - h[l2] * pw[r2 - l2]) % M
        out.append('Yes' if a == b else 'No')
    sys.stdout.write('\n'.join(out) + '\n')


main()
