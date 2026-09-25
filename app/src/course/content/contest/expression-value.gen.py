import random


def rand_expr(depth, width):
    if depth == 0 or random.random() < 0.3:
        return str(random.randint(0, 20))
    parts = [rand_expr(depth - 1, width)]
    for _ in range(random.randint(1, width)):
        parts.append(random.choice(['+', '-', '*', ' + ', ' * ']))
        sub = rand_expr(depth - 1, width)
        parts.append(f'({sub})' if random.random() < 0.3 else sub)
    return ''.join(parts)


def tests():
    random.seed(89)
    out = ['1+(2*2 - 3)\n', '2 - 3 - 4\n', '(((7)))\n', '10*2-3*4+100\n', '2*(3+4)*5\n']
    for d in (2, 3, 4):
        out.append(rand_expr(d, 3) + '\n')
    big = '+'.join(f'({rand_expr(2, 2)})' for _ in range(3000))
    out.append(big + '\n')
    out.append('(' * 3000 + '1' + '+1)' * 3000 + '\n')
    return out


def brute(inp):
    import sys
    s = inp.strip()
    if s.count('(') > 500:
        return None
    return eval(s)
