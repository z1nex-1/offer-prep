import sys


def main():
    data = sys.stdin.buffer.read().split()
    s, k = int(data[0]), int(data[1])
    coins = [c for c in map(int, data[2:2 + k]) if c <= s]
    INF = s + 1
    dp = [INF] * (s + 1)
    dp[0] = 0
    for x in range(1, s + 1):
        best = INF
        for c in coins:
            if c <= x and dp[x - c] + 1 < best:
                best = dp[x - c] + 1
        dp[x] = best
    print(dp[s] if dp[s] < INF else -1)


main()
