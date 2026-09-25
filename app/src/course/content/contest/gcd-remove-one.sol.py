import sys
from math import gcd


def main():
    data = sys.stdin.buffer.read().split()
    n = int(data[0])
    a = list(map(int, data[1:1 + n]))
    suf = [0] * (n + 1)
    for i in range(n - 1, -1, -1):
        suf[i] = gcd(a[i], suf[i + 1])
    best = 0
    pref = 0
    for i in range(n):
        best = max(best, gcd(pref, suf[i + 1]))
        pref = gcd(pref, a[i])
    print(best)


main()
