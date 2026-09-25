import json


def main():
    data = json.loads(input())
    rows = []

    def walk(v, path):
        if isinstance(v, dict) and v:
            for k, x in v.items():
                walk(x, f'{path}.{k}' if path else k)
        elif isinstance(v, list) and v:
            for i, x in enumerate(v):
                walk(x, f'{path}.{i}' if path else str(i))
        else:
            rows.append((path, json.dumps(v, ensure_ascii=False)))

    walk(data, '')
    rows.sort()
    print('\n'.join(f'{p}={v}' for p, v in rows))


main()
