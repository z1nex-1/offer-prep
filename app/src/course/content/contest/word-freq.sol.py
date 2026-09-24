import sys
from collections import Counter

cnt = Counter(sys.stdin.read().split())
items = sorted(cnt.items(), key=lambda p: (-p[1], p[0]))
print('\n'.join(f'{w} {c}' for w, c in items))
