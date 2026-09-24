import random
import string


def pack(rows):
    return f'{len(rows)}\n' + '\n'.join(f'{a} {b} {c}' for a, b, c in rows) + '\n'


def tests():
    random.seed(16)
    out = [pack([('Ivanov', 9, 80), ('Petrov', 10, 95), ('Sidorov', 9, 90), ('Abramov', 9, 80), ('Kuznetsov', 10, 95)]),
           pack([('Solo', 11, 0)]), pack([('B', 10, 5), ('A', 9, 5), ('C', 2, 5), ('D', 1, 100)]),
           pack([('Same', 5, 50), ('Same', 5, 60), ('Same', 5, 50)]), pack([('b', 3, 1), ('a', 3, 1), ('B', 3, 1), ('A', 3, 1)])]
    names = ['Ivanov', 'Petrova', 'Smirnov', 'Kim', 'Lee', 'Orlov', 'Popova']
    for n in (10, 50):
        out.append(pack([(random.choice(names), random.randint(1, 11), random.randint(0, 10)) for _ in range(n)]))
    big = [(''.join(random.choice(string.ascii_letters) for _ in range(random.randint(1, 8))), random.randint(1, 11), random.randint(0, 100)) for _ in range(25000)]
    out.append(pack(big))
    return out


def brute(inp):
    d = inp.split()
    n = int(d[0])
    rows = [(d[1 + 3 * i], int(d[2 + 3 * i]), int(d[3 + 3 * i])) for i in range(n)]
    out = []
    for cls in range(1, 12):
        part = [r for r in rows if r[1] == cls]
        if not part:
            continue
        part.sort(key=lambda r: r[0])
        part.sort(key=lambda r: r[2], reverse=True)
        out.append(f'Class {cls}')
        out += [f'{r[0]} {r[2]}' for r in part]
    return '\n'.join(out)
