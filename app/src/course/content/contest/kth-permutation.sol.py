import sys
from math import factorial


def kth(n, k):
    k -= 1
    free = list(range(1, n + 1))
    res = []
    for i in range(n, 0, -1):
        idx, k = divmod(k, factorial(i - 1))
        res.append(free.pop(idx))
    return res


def main():
    data = sys.stdin.read().split()
    n, q = int(data[0]), int(data[1])
    out = [" ".join(map(str, kth(n, int(k)))) for k in data[2:2 + q]]
    print("\n".join(out))


main()
