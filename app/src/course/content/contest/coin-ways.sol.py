import sys

MOD = 10 ** 9 + 7


def main():
    data = sys.stdin.buffer.read().split()
    s, k = int(data[0]), int(data[1])
    coins = list(map(int, data[2:2 + k]))
    dp = [0] * (s + 1)
    dp[0] = 1
    for c in coins:
        for x in range(c, s + 1):
            dp[x] = (dp[x] + dp[x - c]) % MOD
    print(dp[s])


main()
