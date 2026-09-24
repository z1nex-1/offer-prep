import random


def tests():
    random.seed(48)
    out = ['8750\n', '120\n', '50\n', '10 ** 18'.replace('10 ** 18', str(10 ** 18)) + '\n', '350\n', '6000\n', '49\n']
    for _ in range(10):
        out.append(f'{random.randint(1, 400) * 50}\n')
    return out


def brute(inp):
    s = int(inp)
    if s % 50:
        return -1
    if s > 100000:
        return None
    t = s // 50
    coins = [1, 2, 4, 10, 20, 40, 100]
    dp = [0] + [10 ** 9] * t
    for x in range(1, t + 1):
        dp[x] = min(dp[x - c] + 1 for c in coins if c <= x)
    return dp[t]
