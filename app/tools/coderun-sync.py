"""Выгружает каталог CodeRun и состав подборок в src/course/content/coderun.json."""
import json
import pathlib
import subprocess

API = 'https://coderun.yandex.ru/api/'
SELECTIONS = [
    'backend-interview',
    'yandex-interview',
    '2024-summer-backend',
    'algorithm-training-march-2026',
    'algorithm-training-september-2025',
    'quickstart',
    'dev-go-interview',
    'hr-tech-interview',
    '2026-summer-common',
    '2025-summer-common',
    '2025-winter-common',
    'winter-intern-2024',
    'autumn-intern-2023',
    'mgustokashin',
    'atolstikov',
]
OUT = pathlib.Path(__file__).resolve().parent.parent / 'src/course/content/coderun.json'


def get(path):
    # curl, а не urllib: у Python из Homebrew часто нет корневых сертификатов
    raw = subprocess.run(['curl', '-sf', '--retry', '5', '--retry-all-errors', '-A', 'Mozilla/5.0', API + path], capture_output=True, check=True).stdout
    return json.loads(raw)['result']['data']


def pages(path):
    out, page = [], 1
    while True:
        chunk = get(f'{path}currentPage={page}&pageSize=100')
        out += chunk
        if len(chunk) < 100:
            return out
        page += 1


catalog = pages('catalogue/problem/search?search=&')
members = {s: [p['slug'] for p in pages(f'selections/{s}/problem/search?')] for s in SELECTIONS}

problems = []
for p in catalog:
    groups = set(p['groupSlugs'])
    sel = [s for s in SELECTIONS if p['slug'] in members[s]]
    if not (groups & {'algorithm', 'backend'}) or 'python' not in p['compilerLanguages']:
        continue
    problems.append({
        'slug': p['slug'],
        'title': p['title'],
        'd': (p['difficulty'] or 'U')[0],
        'tags': p['tags'],
        'sel': sel,
        'rate': round(p['digitalDifficulty'] or 0),
    })

problems.sort(key=lambda p: (p['rate'], p['slug']))
OUT.write_text(json.dumps(problems, ensure_ascii=False, separators=(',', ':')))
print(len(catalog), 'в каталоге,', len(problems), 'с Python в алгоритмах и бэкенде')
