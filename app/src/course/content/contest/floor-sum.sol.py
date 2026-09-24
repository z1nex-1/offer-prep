n = int(input())
total, i = 0, 1
while i <= n:
    q = n // i
    last = n // q
    total += q * (last - i + 1)
    i = last + 1
print(total)
