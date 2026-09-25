import sys

MOD = 10 ** 9 + 7


def main():
    data = sys.stdin.buffer.read().split()
    n, k = int(data[0]), int(data[1])
    broken = set(map(int, data[2:2 + k]))
    dp = [0] * (n + 1)
    dp[0] = 1
    for i in range(1, n + 1):
        if i in broken:
            continue
        s = dp[i - 1]
        if i >= 2:
            s += dp[i - 2]
        if i >= 3:
            s += dp[i - 3]
        dp[i] = s % MOD
    print(dp[n])


main()
