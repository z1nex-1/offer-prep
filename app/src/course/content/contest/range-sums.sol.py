import sys


def main():
    data = sys.stdin.buffer.read().split()
    n, q = int(data[0]), int(data[1])
    pref = [0] * (n + 1)
    for i in range(n):
        pref[i + 1] = pref[i] + int(data[2 + i])
    out = []
    pos = 2 + n
    for _ in range(q):
        l, r = int(data[pos]), int(data[pos + 1])
        pos += 2
        out.append(pref[r] - pref[l - 1])
    print('\n'.join(map(str, out)))


main()
