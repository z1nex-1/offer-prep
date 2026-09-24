import sys


def main():
    data = sys.stdin.buffer.read().split()
    n, k = int(data[0]), int(data[1])
    cnt = {0: 1}
    cur = res = 0
    for i in range(n):
        cur += int(data[2 + i])
        res += cnt.get(cur - k, 0)
        cnt[cur] = cnt.get(cur, 0) + 1
    print(res)


main()
