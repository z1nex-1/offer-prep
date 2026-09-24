import sys

input = sys.stdin.readline
q = int(input())
book = {}
out = []
for _ in range(q):
    cmd = input().split()
    if cmd[0] == 'ADD':
        book[cmd[1]] = cmd[2]
    elif cmd[0] == 'DEL':
        book.pop(cmd[1], None)
    elif cmd[0] == 'FIND':
        out.append(book.get(cmd[1], 'NOT FOUND'))
    else:
        out.append(str(len(book)))
print('\n'.join(out))
