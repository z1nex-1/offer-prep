import sys

lines = sys.stdin.read().split()
n = int(lines[0])
seen = set()
for e in lines[1:1 + n]:
    local, domain = e.lower().split('@')
    local = local.split('+')[0].replace('.', '')
    seen.add(local + '@' + domain)
print(len(seen))
