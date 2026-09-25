import sys


def main():
    data = sys.stdin.buffer.read().split()
    n, k = int(data[0]), int(data[1])
    cnt = {}
    ans = 0
    for x in data[2:2 + n]:
        r = int(x) % k
        ans += cnt.get((k - r) % k, 0)
        cnt[r] = cnt.get(r, 0) + 1
    print(ans)


main()
