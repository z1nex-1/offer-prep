import json
import random

KEYS = ['db', 'host', 'port', 'a', 'b', 'a_1', 'debug', 'workers', 'x10', 'x9', 'name', 'tags']


def val(depth):
    r = random.random()
    if depth > 0 and r < 0.3:
        return {random.choice(KEYS): val(depth - 1) for _ in range(random.randint(0, 4))}
    if depth > 0 and r < 0.45:
        return [val(depth - 1) for _ in range(random.randint(0, 12))]
    return random.choice([random.randint(-1000, 1000), 'txt', 'сервис', 'q"uote', True, False, None, ''])


def tests():
    random.seed(157)
    out = ['{"db": {"hosts": ["a", "b"], "port": 5432}, "debug": false}\n',
           '{"a": {}, "b": [], "c": null}\n',
           '{"a": 1, "a_b": {"c": [1, [2, {"d": "x"}]]}}\n',
           '{"k": "\\u043f\\u0440\\u0438\\u0432\\u0435\\u0442", "s": "a\\"b"}\n']
    for d in (2, 3, 4):
        out.append(json.dumps({random.choice(KEYS): val(d) for _ in range(5)}, ensure_ascii=False) + '\n')
    big = {f'svc{i}': {'port': 8000 + i, 'hosts': [f'h{j}' for j in range(8)], 'on': i % 2 == 0} for i in range(600)}
    out.append(json.dumps(big) + '\n')
    deep = 'leaf'
    for i in range(50):
        deep = {f'l{i}': deep}
    out.append(json.dumps(deep) + '\n')
    return out


def brute(inp):
    import json
    data = json.loads(inp)
    rows = []
    stack = [('', data)]
    while stack:
        path, v = stack.pop()
        if isinstance(v, dict) and len(v) > 0:
            for k in v:
                stack.append(((path + '.' if path else '') + k, v[k]))
        elif isinstance(v, list) and len(v) > 0:
            for i in range(len(v)):
                stack.append(((path + '.' if path else '') + str(i), v[i]))
        else:
            rows.append((path, json.dumps(v, ensure_ascii=False)))
    rows.sort(key=lambda r: r[0])
    return '\n'.join(p + '=' + v for p, v in rows)
