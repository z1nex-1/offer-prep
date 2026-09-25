import random


def tests():
    random.seed(138)
    out = ['3\n3\n1\n8\n', '1\n1\n', '4\n2\n7\n16\n15\n']
    out.append(f"50\n" + '\n'.join(str(random.randint(1, 3000)) for _ in range(50)) + '\n')
    out.append('3\n1000000000000000000\n576460752303423487\n576460752303423488\n')
    out.append(f"10000\n" + '\n'.join(str(random.randint(1, 10 ** 18)) for _ in range(10000)) + '\n')
    return out


def brute(inp):
    d = list(map(int, inp.split()))
    if max(d[1:]) > 5000:
        return None
    return '\n'.join(str(sum(bin(x).count('1') for x in range(1, n + 1))) for n in d[1:])
