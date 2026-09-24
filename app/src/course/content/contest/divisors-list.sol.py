n = int(input())
small, big = [], []
d = 1
while d * d <= n:
    if n % d == 0:
        small.append(d)
        if d != n // d:
            big.append(n // d)
    d += 1
res = small + big[::-1]
print(len(res))
print(' '.join(map(str, res)))
