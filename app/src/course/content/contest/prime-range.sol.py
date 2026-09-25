import sys
from itertools import accumulate


def main():
    data = sys.stdin.buffer.read().split()
    q = int(data[0])
    qs = [(int(data[1 + 2 * i]), int(data[2 + 2 * i])) for i in range(q)]
    top = max(r for _, r in qs)
    sieve = bytearray([1]) * (top + 1)
    sieve[0] = 0
    if top >= 1:
        sieve[1] = 0
    p = 2
    while p * p <= top:
        if sieve[p]:
            sieve[p * p::p] = bytes(len(range(p * p, top + 1, p)))
        p += 1
    pref = list(accumulate(sieve))
    print('\n'.join(str(pref[r] - pref[l - 1]) for l, r in qs))


main()
