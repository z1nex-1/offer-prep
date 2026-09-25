import sys

MOD = 10 ** 9 + 7


def main():
    data = sys.stdin.buffer.read().split()
    q = int(data[0])
    qs = [(int(data[1 + 2 * i]), int(data[2 + 2 * i])) for i in range(q)]
    top = max(n for n, _ in qs)
    fact = [1] * (top + 1)
    for i in range(1, top + 1):
        fact[i] = fact[i - 1] * i % MOD
    inv = [1] * (top + 1)
    inv[top] = pow(fact[top], MOD - 2, MOD)
    for i in range(top, 0, -1):
        inv[i - 1] = inv[i] * i % MOD
    out = []
    for n, k in qs:
        out.append(0 if k > n else fact[n] * inv[k] % MOD * inv[n - k] % MOD)
    print('\n'.join(map(str, out)))


main()
