import random


def tests():
    random.seed(1)
    out = ['23:50\n30\n', '07:05\n0\n', '00:00\n1440\n', '23:59\n1\n', '12:00\n720\n', '09:09\n51\n', '00:00\n1000000000\n', '23:59\n999999999\n']
    for _ in range(12):
        out.append(f'{random.randint(0, 23):02d}:{random.randint(0, 59):02d}\n{random.choice([random.randint(0, 3000), random.randint(0, 10**9)])}\n')
    return out


def brute(inp):
    t, k = inp.split()
    h, m = map(int, t.split(':'))
    k = int(k)
    if k > 5000:
        return None
    for _ in range(k):
        m += 1
        if m == 60:
            m, h = 0, h + 1
        if h == 24:
            h = 0
    return f'{h:02d}:{m:02d}'
