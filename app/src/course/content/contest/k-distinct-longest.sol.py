import sys


def main():
    data = sys.stdin.buffer.read().split()
    n, k = int(data[0]), int(data[1])
    a = data[2:2 + n]
    cnt = {}
    l = best = 0
    for r in range(n):
        x = a[r]
        cnt[x] = cnt.get(x, 0) + 1
        while len(cnt) > k:
            y = a[l]
            cnt[y] -= 1
            if cnt[y] == 0:
                del cnt[y]
            l += 1
        if r - l + 1 > best:
            best = r - l + 1
    print(best)


main()
