import random

METHODS = ['GET', 'POST', 'PUT', 'DELETE']
PATHS = ['/api/users', '/api/orders', '/health', '/api/users/42', '/login', '/api/items']
CODES = [200, 200, 200, 201, 204, 301, 400, 404, 500, 502, 503, 599, 600]


def line():
    h, m, s = random.randrange(24), random.randrange(60), random.randrange(60)
    tail = ' ' * random.choice([0, 0, 0, 1, 3])
    return f'2025-10-18T{h:02d}:{m:02d}:{s:02d} {random.choice(METHODS)} {random.choice(PATHS)} {random.choice(CODES)} {random.randint(0, 5000)}ms{tail}'


def tests():
    random.seed(156)
    out = [
        '2025-10-18T12:03:05 GET /api/users 200 35ms\n2025-10-18T12:03:06 GET /api/users 500 120ms\n2025-10-18T12:03:07 POST /login 404 10ms\n',
        '\n2025-10-18T00:00:00 GET /health 200 1ms   \n\n2025-10-18T00:00:01 GET /health 503 2ms\n\n',
        '2025-10-18T23:59:59 PUT /a 599 7ms\n2025-10-18T23:59:59 GET /a 600 8ms\n2025-10-18T23:59:59 GET /b 499 9ms\n',
    ]
    for n in (8, 40):
        out.append('\n'.join(line() for _ in range(n)) + '\n')
    out.append('\n'.join(line() if random.random() > 0.02 else '' for _ in range(20000)) + '\n')
    return out


def brute(inp):
    from collections import defaultdict
    cnt = defaultdict(int)
    err = defaultdict(int)
    tot = defaultdict(int)
    for raw in inp.split('\n'):
        f = raw.split()
        if not f:
            continue
        k = f[1] + ' ' + f[2]
        cnt[k] += 1
        err[k] += int(f[3]) // 100 == 5
        tot[k] += int(f[4].replace('ms', ''))
    keys = sorted(cnt, key=lambda k: (-cnt[k], k))
    return '\n'.join(f'{k} {cnt[k]} {err[k]} {tot[k] // cnt[k]}' for k in keys)
