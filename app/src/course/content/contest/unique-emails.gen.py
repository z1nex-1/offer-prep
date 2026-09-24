import random


def pack(a):
    return f'{len(a)}\n' + '\n'.join(a) + '\n'


def variant(local, domain):
    s = list(local)
    for _ in range(random.randint(0, 2)):
        s.insert(random.randint(0, len(s)), '.')
    s = ''.join(s)
    if random.random() < 0.4:
        s += '+' + ''.join(random.choice('ab.+x') for _ in range(random.randint(0, 4)))
    s = ''.join(c.upper() if random.random() < 0.3 else c for c in s)
    d = ''.join(c.upper() if random.random() < 0.3 else c for c in domain)
    return s + '@' + d


def tests():
    random.seed(52)
    out = [pack(['Ivan.Petrov+spam@mail.ru', 'ivanpetrov@mail.ru', 'ivan.petrov@yandex.ru', 'IVANPETROV@MAIL.RU', 'ivan@mail.ru']),
           pack(['a@b.c']), pack(['a@ya.ru', 'a@yar.u']), pack(['+x@ya.ru', '.@ya.ru', 'q@ya.ru']), pack(['a+b+c@x.y', 'a@x.y', 'a.+@x.y']),
           pack(['a@x+y.ru', 'a@x.ru'])]
    domains = ['ya.ru', 'mail.ru', 'yar.u', 'gmail.com', 'x.y']
    for n, k in ((10, 3), (30, 5), (200, 20), (2000, 300)):
        locs = [''.join(random.choice('abc1') for _ in range(random.randint(1, 5))) for _ in range(k)]
        out.append(pack([variant(random.choice(locs), random.choice(domains)) for _ in range(n)]))
    locs = [''.join(random.choice('abcdefgh') for _ in range(random.randint(1, 8))) for _ in range(10000)]
    out.append(pack([variant(random.choice(locs), random.choice(domains)) for _ in range(50000)]))
    return out


def brute(inp):
    lines = inp.split()
    res = []
    for e in lines[1:]:
        at = e.index('@')
        local, domain = e[:at], e[at + 1:]
        clean = ''
        for c in local:
            if c == '+':
                break
            if c != '.':
                clean += c.lower()
        key = clean + '@' + domain.lower()
        if key not in res:
            res.append(key)
    return str(len(res))
