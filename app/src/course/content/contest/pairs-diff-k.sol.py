import sys


def main():
    data = sys.stdin.buffer.read().split()
    n, k = int(data[0]), int(data[1])
    cnt = {}
    res = 0
    for i in range(n):
        x = int(data[2 + i])
        if k == 0:
            res += cnt.get(x, 0)
        else:
            res += cnt.get(x - k, 0) + cnt.get(x + k, 0)
        cnt[x] = cnt.get(x, 0) + 1
    print(res)


main()
