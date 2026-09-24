import sys

data = sys.stdin.read().split()
q = int(data[0])
res = []
for i in range(q):
    a, b, c, d = map(int, data[1 + 4 * i:5 + 4 * i])
    left, right = a * d, c * b
    res.append('<' if left < right else '>' if left > right else '=')
print('\n'.join(res))
