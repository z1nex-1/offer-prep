import random


def tests():
    random.seed(123)
    out = ['6 3\n1 3 4\n', '3 1\n2\n', '11 3\n1 2 5\n', '7 2\n5 3\n', '1 1\n100\n']
    for s in (15, 25, 40):
        coins = random.sample(range(1, s + 1), random.randint(1, 4))
        out.append(f"{s} {len(coins)}\n{' '.join(map(str, coins))}\n")
    coins = random.sample(range(2, 5000), 30)
    out.append(f"30000 30\n{' '.join(map(str, coins))}\n")
    return out


def brute(inp):
    d = list(map(int, inp.split()))
    s, k, coins = d[0], d[1], d[2:]
    if s > 40:
        return None
    from collections import deque
    dist = {0: 0}
    q = deque([0])
    while q:
        x = q.popleft()
        for c in coins:
            y = x + c
            if y <= s and y not in dist:
                dist[y] = dist[x] + 1
                q.append(y)
    return dist.get(s, -1)
