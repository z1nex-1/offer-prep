h, a, b = map(int, input().split())
if h <= a:
    print(1)
elif a <= b:
    print(-1)
else:
    print((h - a + (a - b) - 1) // (a - b) + 1)
