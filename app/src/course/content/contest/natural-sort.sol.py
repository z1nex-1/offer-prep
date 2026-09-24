import re
import sys


def natural(s):
    return [(0, int(c), len(c)) if c.isdigit() else (1, c, 0) for c in re.findall(r'\d+|\D+', s)]


data = sys.stdin.read().split()
n = int(data[0])
print('\n'.join(sorted(data[1:1 + n], key=natural)))
