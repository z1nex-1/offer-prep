import sys


def main():
    data = sys.stdin.buffer.read().split()
    n, s = int(data[0]), int(data[1])
    a = sorted(map(int, data[2:2 + n]))
    l, r = 0, n - 1
    res = 0
    while l < r:
        if a[l] + a[r] <= s:
            res += r - l
            l += 1
        else:
            r -= 1
    print(res)


main()
