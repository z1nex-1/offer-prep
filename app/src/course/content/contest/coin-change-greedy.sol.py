S = int(input())
if S % 50:
    print(-1)
else:
    cnt = 0
    for c in (5000, 2000, 1000, 500, 200, 100, 50):
        k, S = divmod(S, c)
        cnt += k
    print(cnt)
