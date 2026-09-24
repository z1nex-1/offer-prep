import random


def tests():
    random.seed(25)
    out = ['6\neat\ntea\ntan\nate\nnat\nbat\n', '1\na\n', '3\nab\nab\nba\n', '3\nabc\nabd\nabe\n']
    for n in (10, 60):
        ws = [''.join(random.choice('abc') for _ in range(random.randint(1, 4))) for _ in range(n)]
        out.append(f"{n}\n" + '\n'.join(ws) + '\n')
    ws = [''.join(random.choice('abcdef') for _ in range(random.randint(3, 8))) for _ in range(40000)]
    out.append('40000\n' + '\n'.join(ws) + '\n')
    return out


def brute(inp):
    ws = inp.split()[1:]
    groups = []
    for w in ws:
        for g in groups:
            if sorted(g[0]) == sorted(w):
                g.append(w)
                break
        else:
            groups.append([w])
    return f'{len(groups)} {max(len(g) for g in groups)}'
