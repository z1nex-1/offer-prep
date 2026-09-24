import random
import re
import string


def tests():
    random.seed(6)
    sample = ['Passw0rd', 'password1', 'Paaassw0rd', 'Ab1', 'Abcdefg1', 'A1b2C3d4' * 4, 'A1b2C3d4' * 4 + 'x', '12345678Aa', 'Ab1!@#$%^&*()']
    out = [f'{len(sample)}\n' + '\n'.join(sample) + '\n']
    edge = ['aaAA11bb', 'aaaA11bb', 'Aa1Aa1Aa1', 'AAAAAAAA', 'abcdefgh', '1234567A', '!!!!aA1x', 'aA1' + '!!' + 'bB2', 'Zz9Zz9Z', 'Zz9Zz9Zz']
    out.append(f'{len(edge)}\n' + '\n'.join(edge) + '\n')
    for alphabet, q in (('aA1', 50), ('abAB12!', 200), (string.ascii_letters + string.digits + '!#$%', 2000)):
        ps = [''.join(random.choice(alphabet) for _ in range(random.randint(1, 40))) for _ in range(q)]
        out.append(f'{q}\n' + '\n'.join(ps) + '\n')
    pool = [chr(c) for c in range(33, 127)]
    ps = [''.join(random.choice(pool) for _ in range(random.randint(1, 100))) for _ in range(5000)]
    out.append(f'{len(ps)}\n' + '\n'.join(ps) + '\n')
    return out


def brute(inp):
    data = inp.split()
    res = []
    for p in data[1:]:
        good = (8 <= len(p) <= 32 and re.search('[a-z]', p) and re.search('[A-Z]', p)
                and re.search('[0-9]', p) and not re.search(r'(.)\1\1', p))
        res.append('YES' if good else 'NO')
    return '\n'.join(res)
