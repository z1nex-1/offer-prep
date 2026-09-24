s = input().strip()
x = sum(map(int, s))
while x >= 10:
    x = sum(map(int, str(x)))
print(x)
