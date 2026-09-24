def tests():
    return [f'{n}\n' for n in (2, 3, 1, 4, 5, 7, 10, 11, 12)]


def brute(inp):
    # Независимая проверка: итеративный алгоритм без рекурсии.
    # Нечётный ход — самый маленький диск по кругу, чётный — единственный другой допустимый ход.
    n = int(inp)
    pegs = {1: list(range(n, 0, -1)), 2: [], 3: []}
    order = [1, 2, 3] if n % 2 == 0 else [1, 3, 2]
    pos = 0
    out = []
    for step in range(2 ** n - 1):
        if step % 2 == 0:
            a, c = order[pos], order[(pos + 1) % 3]
            pos = (pos + 1) % 3
        else:
            x, y = [p for p in (1, 2, 3) if p != order[pos]]
            if not pegs[x] or (pegs[y] and pegs[y][-1] < pegs[x][-1]):
                x, y = y, x
            a, c = x, y
        pegs[c].append(pegs[a].pop())
        out.append(f'{a} {c}')
    assert pegs[3] == list(range(n, 0, -1))
    return f'{len(out)}\n' + '\n'.join(out)
