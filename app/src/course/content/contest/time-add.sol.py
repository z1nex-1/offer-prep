h, m = map(int, input().split(':'))
k = int(input())
t = (h * 60 + m + k) % (24 * 60)
print(f"{t // 60:02d}:{t % 60:02d}")
