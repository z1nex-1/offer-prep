n, k = map(int, input().split())
buses = (n + k - 1) // k
print(buses, buses * k - n)
