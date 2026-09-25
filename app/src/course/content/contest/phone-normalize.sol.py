import sys

TRASH = str.maketrans('', '', ' -()')


def norm(raw):
    s = raw.translate(TRASH)
    if s.startswith('+'):
        body = s[1:]
        if len(body) == 11 and body.isdigit() and body[0] == '7':
            return '+' + body
        return 'error'
    if not s.isdigit():
        return 'error'
    if len(s) == 11 and s[0] in '78':
        return '+7' + s[1:]
    if len(s) == 10:
        return '+7' + s
    return 'error'


def main():
    lines = sys.stdin.read().split('\n')
    n = int(lines[0])
    rows = lines[1:1 + n]
    rows += [''] * (n - len(rows))
    print('\n'.join(norm(r.rstrip('\r')) for r in rows))


main()
