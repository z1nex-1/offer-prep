import random
import string


def rnd_word(k):
    return ''.join(random.choice('abc') for _ in range(k))


def make(p, words):
    return p + '\n' + ' '.join(words) + '\n'


def tests():
    random.seed(51)
    out = [make('abba', 'dog cat cat dog'.split()), make('ab', 'dog dog'.split()), make('aaaa', 'dog cat cat dog'.split()),
           make('abba', 'dog dog dog dog'.split()), make('a', ['x']), make('ab', ['x']), make('abc', 'b c a'.split()),
           make('aa', 'aa aa'.split()), make('abab', 'x y x'.split()), make('abcabc', 'one two three one two three'.split())]
    for n, k in ((5, 3), (8, 4), (12, 5), (30, 26)):
        for _ in range(3):
            p = ''.join(random.choice(string.ascii_lowercase[:k]) for _ in range(n))
            dic = {}
            for ch in string.ascii_lowercase[:k]:
                dic[ch] = rnd_word(random.randint(1, 3))
            words = [dic[ch] for ch in p]
            if random.random() < 0.5:
                i = random.randrange(n)
                words[i] = rnd_word(random.randint(1, 3))
            out.append(make(p, words))
    letters = string.ascii_lowercase
    dic = {ch: ch * 3 + str(i) for i, ch in enumerate(letters)}
    dic = {ch: ''.join(chr(97 + (ord(c) - 48) % 26) if c.isdigit() else c for c in w) for ch, w in dic.items()}
    p = ''.join(random.choice(letters) for _ in range(50000))
    out.append(make(p, [dic[ch] for ch in p]))
    words = [dic[ch] for ch in p]
    words[-1] = dic[p[0]] if p[-1] != p[0] else dic['a' if p[0] != 'a' else 'b']
    out.append(make(p, words))
    return out


def brute(inp):
    lines = inp.split('\n')
    p, words = lines[0], lines[1].split()
    if len(p) != len(words):
        return 'NO'
    for i in range(len(p)):
        for j in range(len(p)):
            if (p[i] == p[j]) != (words[i] == words[j]):
                return 'NO'
    return 'YES'
