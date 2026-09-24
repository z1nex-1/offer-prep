import math
import sys

sys.set_int_max_str_digits(0)
n = int(input())
s = str(math.factorial(n))
print(len(s), sum(map(int, s)))
