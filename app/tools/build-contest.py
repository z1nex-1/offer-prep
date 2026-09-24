"""Собирает тесты контест-задач.

Для каждой задачи content/contest/<id>.md рядом лежат:
  <id>.sol.py — эталонное решение (stdin -> stdout), его видит пользователь после решения;
  <id>.gen.py — функция tests() со списком входов (первые samples из front matter — примеры
                 из условия) и необязательная brute(inp) -> str для сверки на маленьких тестах.
Эталон прогоняется на всех входах. Примеры попадают в бандл (content/contest.gen.json),
полный набор тестов — в public/contest/<id>.json: он загружается только при отправке решения.
"""
import importlib.util
import json
import pathlib
import subprocess
import sys
import time

ROOT = pathlib.Path(__file__).resolve().parent.parent / 'src/course/content'
DIR = ROOT / 'contest'
PUBLIC = pathlib.Path(__file__).resolve().parent.parent / 'public/contest'


def meta_of(md):
    text = md.read_text()
    head = text.split('\n---\n', 1)[0].removeprefix('---\n')
    return dict(line.split(':', 1) for line in head.splitlines() if ':' in line)


def load_gen(path):
    spec = importlib.util.spec_from_file_location(path.stem.replace('.', '_'), path)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


def run(sol, inp):
    t0 = time.perf_counter()
    r = subprocess.run([sys.executable, str(sol)], input=inp, capture_output=True, text=True, timeout=20)
    if r.returncode:
        raise RuntimeError(r.stderr.strip().splitlines()[-1] if r.stderr.strip() else f'код {r.returncode}')
    return r.stdout, time.perf_counter() - t0


def norm(s):
    return '\n'.join(line.rstrip() for line in s.strip().splitlines())


only = set(sys.argv[1:])
out_path = ROOT / 'contest.gen.json'
result = json.loads(out_path.read_text()) if out_path.exists() and only else {}
fails = 0
for md in sorted(DIR.glob('*.md')):
    meta = {k.strip(): v.strip() for k, v in meta_of(md).items()}
    pid = meta['id']
    if only and pid not in only:
        continue
    sol, gen = DIR / f'{pid}.sol.py', DIR / f'{pid}.gen.py'
    if md.stem != pid or not sol.exists() or not gen.exists():
        print('НЕТ ФАЙЛОВ', pid)
        fails += 1
        continue
    g = load_gen(gen)
    inputs = g.tests()
    samples = int(meta.get('samples', 2))
    tests, worst = [], 0.0
    for i, inp in enumerate(inputs):
        if not inp.endswith('\n'):
            inp += '\n'
        try:
            out, dt = run(sol, inp)
        except Exception as e:
            print(f'ОШИБКА {pid} тест {i + 1}: {e}')
            fails += 1
            break
        worst = max(worst, dt)
        if hasattr(g, 'brute') and len(inp) < 3000:
            want = g.brute(inp)
            if norm(str(want)).split() != norm(out).split():
                print(f'НЕ СОВПАЛО С ПЕРЕБОРОМ {pid} тест {i + 1}:\n{inp[:300]}\nэталон: {norm(out)[:200]}\nперебор: {norm(str(want))[:200]}')
                fails += 1
        tests.append({'in': inp, 'out': norm(out) + '\n'})
    if len(tests) <= samples:
        print('МАЛО ТЕСТОВ', pid)
        fails += 1
    result[pid] = {'samples': tests[:samples], 'count': len(tests)}
    PUBLIC.mkdir(parents=True, exist_ok=True)
    (PUBLIC / f'{pid}.json').write_text(json.dumps(tests, ensure_ascii=False, separators=(',', ':')))
    size = sum(len(t['in']) + len(t['out']) for t in tests)
    print(f'{pid}: {len(tests)} тестов, {size // 1024} КБ, эталон до {worst:.2f} с')

out_path.write_text(json.dumps(result, ensure_ascii=False, separators=(',', ':')))
print('задач:', len(result), 'ошибок:', fails)
sys.exit(1 if fails else 0)
