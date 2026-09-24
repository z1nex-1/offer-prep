import math

n, a, b = map(int, input().split())
print(n // a + n // b - n // math.lcm(a, b))
