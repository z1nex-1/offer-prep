from itertools import permutations

s = sorted(input().strip())
print('\n'.join(''.join(p) for p in permutations(s)))
