import math

s1, p, s2, q = map(int, input().split())
g = math.gcd(p, q)
if (s1 - s2) % g:
    print(-1)
else:
    top = max(s1, s2)
    t = s1 + max(0, -(-(top - s1) // p)) * p
    ans = -1
    for _ in range(q // g + 1):
        if (t - s2) % q == 0:
            ans = t
            break
        t += p
    print(ans)
