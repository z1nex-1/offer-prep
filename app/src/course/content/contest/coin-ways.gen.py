import random


def tests():
    random.seed(122)
    out = ['5 3\n1 2 5\n', '3 1\n2\n', '10 1\n10\n', '4 2\n1 2\n']
    for s in (12, 20, 30):
        coins = random.sample(range(1, s + 1), random.randint(1, 5))
        out.append(f"{s} {len(coins)}\n{' '.join(map(str, coins))}\n")
    coins = random.sample(range(1, 20001), 40)
    out.append(f"20000 40\n{' '.join(map(str, coins))}\n")
    return out


def brute(inp):
    d = list(map(int, inp.split()))
    s, k, coins = d[0], d[1], sorted(d[2:])
    if s > 30:
        return None
    def go(rem, i):
        if rem == 0:
            return 1
        if i == len(coins):
            return 0
        total = 0
        c = coins[i]
        t = 0
        while t * c <= rem:
            total += go(rem - t * c, i + 1)
            t += 1
        return total
    return go(s, 0) % (10 ** 9 + 7)
