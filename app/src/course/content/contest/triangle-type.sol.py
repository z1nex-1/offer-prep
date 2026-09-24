a, b, c = sorted(map(int, input().split()))
if a + b <= c:
    print("impossible")
elif a * a + b * b == c * c:
    print("right")
elif a * a + b * b > c * c:
    print("acute")
else:
    print("obtuse")
