import type { Problem } from '../types'

export const problemsA: Problem[] = [
  {
    id: 'two-sum-sorted',
    title: 'Пара с заданной суммой в отсортированном массиве',
    difficulty: 'easy',
    pattern: 'Два указателя',
    topic: 'algo-arrays',
    statement: `Дан массив целых чисел \`nums\`, отсортированный по неубыванию, и число \`target\`. Найдите два **разных** индекса \`i < j\`, такие что \`nums[i] + nums[j] == target\`, и верните \`[i, j]\`. Если пары нет, верните \`[]\`. Если пар несколько — верните пару с наименьшим \`i\`, а при равенстве — с наименьшим \`j\`.

Ограничения: до 10⁵ элементов. Нужно решение за O(n) и O(1) доп. памяти.`,
    fn: 'pairSum',
    params: ['nums', 'target'],
    tests: [
      { args: [[1, 2, 4, 7, 11], 9], expected: [1, 3] },
      { args: [[1, 3], 4], expected: [0, 1] },
      { args: [[1, 2, 3], 10], expected: [] },
      { args: [[], 0], expected: [] },
      { args: [[-5, -1, 0, 3, 8], 3], expected: [0, 4] },
      { args: [[2, 2, 2, 2], 4], expected: [0, 1] },
    ],
    starter: {
      py: 'def pairSum(nums, target):\n    pass\n',
      js: 'function pairSum(nums, target) {\n    \n}\n',
    },
    solution: {
      py: `def pairSum(nums, target):
    l, r = 0, len(nums) - 1
    while l < r:
        s = nums[l] + nums[r]
        if s == target:
            # ищем минимальный j для этого l
            j = l + 1
            while nums[j] != target - nums[l]:
                j += 1
            return [l, j]
        if s < target:
            l += 1
        else:
            r -= 1
    return []`,
      js: `function pairSum(nums, target) {
    let l = 0, r = nums.length - 1
    while (l < r) {
        const s = nums[l] + nums[r]
        if (s === target) {
            let j = l + 1
            while (nums[j] !== target - nums[l]) j++
            return [l, j]
        }
        if (s < target) l++
        else r--
    }
    return []
}`,
    },
    explanation: `Встречные указатели: если сумма меньше цели, левый элемент с текущим правым уже ничего не даст — сдвигаем \`l\`. Если больше — сдвигаем \`r\`. Первая найденная пара имеет минимальный \`l\`: все меньшие левые индексы уже отброшены как невозможные. Чтобы вернуть минимальный \`j\` при дубликатах, после нахождения пары ищем первое подходящее значение правее \`l\` — это не меняет итоговую оценку O(n).

**Сложность:** O(n) времени, O(1) памяти.`,
    hints: ['Массив отсортирован — чем это помогает, если сумма оказалась слишком маленькой?', 'Поставьте один указатель в начало, другой в конец.'],
  },
  {
    id: 'move-zeroes',
    title: 'Сдвинуть нули в конец',
    difficulty: 'easy',
    pattern: 'Два указателя',
    topic: 'algo-arrays',
    statement: `Дан массив \`nums\`. Переставьте элементы так, чтобы все нули оказались в конце, а порядок ненулевых сохранился. Верните получившийся массив. Постарайтесь сделать это на месте за один-два прохода.`,
    fn: 'moveZeroes',
    params: ['nums'],
    tests: [
      { args: [[0, 1, 0, 3, 12]], expected: [1, 3, 12, 0, 0] },
      { args: [[0]], expected: [0] },
      { args: [[1, 2, 3]], expected: [1, 2, 3] },
      { args: [[0, 0, 1]], expected: [1, 0, 0] },
      { args: [[]], expected: [] },
      { args: [[4, 0, -1, 0, 0, 5]], expected: [4, -1, 5, 0, 0, 0] },
    ],
    solution: {
      py: `def moveZeroes(nums):
    w = 0
    for x in nums:
        if x != 0:
            nums[w] = x
            w += 1
    for i in range(w, len(nums)):
        nums[i] = 0
    return nums`,
      js: `function moveZeroes(nums) {
    let w = 0
    for (const x of nums) if (x !== 0) nums[w++] = x
    for (let i = w; i < nums.length; i++) nums[i] = 0
    return nums
}`,
    },
    explanation: `Указатель записи \`w\` показывает, куда положить следующий ненулевой элемент. Проходим массив, переносим ненулевые на позицию \`w\`, затем заполняем хвост нулями. Порядок ненулевых сохраняется, потому что мы переносим их в порядке появления.

**Сложность:** O(n) времени, O(1) памяти.`,
    hints: ['Заведите индекс, куда будете записывать следующий ненулевой элемент.'],
  },
  {
    id: 'remove-duplicates',
    title: 'Удалить дубликаты из отсортированного массива',
    difficulty: 'easy',
    pattern: 'Два указателя',
    topic: 'algo-arrays',
    statement: `Дан отсортированный по неубыванию массив. Верните массив его уникальных значений в том же порядке. Решите за O(n) и O(1) доп. памяти (перезаписывая исходный массив).`,
    fn: 'dedupe',
    params: ['nums'],
    tests: [
      { args: [[1, 1, 2]], expected: [1, 2] },
      { args: [[0, 0, 1, 1, 1, 2, 2, 3, 3, 4]], expected: [0, 1, 2, 3, 4] },
      { args: [[]], expected: [] },
      { args: [[7]], expected: [7] },
      { args: [[-3, -3, -3]], expected: [-3] },
    ],
    solution: {
      py: `def dedupe(nums):
    if not nums:
        return []
    w = 1
    for r in range(1, len(nums)):
        if nums[r] != nums[w - 1]:
            nums[w] = nums[r]
            w += 1
    return nums[:w]`,
      js: `function dedupe(nums) {
    if (!nums.length) return []
    let w = 1
    for (let r = 1; r < nums.length; r++) {
        if (nums[r] !== nums[w - 1]) nums[w++] = nums[r]
    }
    return nums.slice(0, w)
}`,
    },
    explanation: `Медленный указатель \`w\` отмечает конец уже собранной уникальной части. Быстрый \`r\` читает элементы; если значение отличается от последнего записанного, дописываем его. Сортировка гарантирует, что одинаковые значения стоят подряд.

**Сложность:** O(n) времени, O(1) памяти.`,
    hints: ['Одинаковые элементы стоят рядом. С каким элементом достаточно сравнивать текущий?'],
  },
  {
    id: 'valid-palindrome',
    title: 'Палиндром с пропуском лишних символов',
    difficulty: 'easy',
    pattern: 'Два указателя',
    topic: 'algo-arrays',
    statement: `Проверьте, является ли строка палиндромом, если учитывать только буквы и цифры (латиница и кириллица) и не различать регистр. Пустая строка — палиндром.`,
    fn: 'isPalindrome',
    params: ['s'],
    tests: [
      { args: ['A man, a plan, a canal: Panama'], expected: true },
      { args: ['race a car'], expected: false },
      { args: [' '], expected: true },
      { args: ['А роза упала на лапу Азора'], expected: true },
      { args: ['0P'], expected: false },
      { args: ['ab_a'], expected: true },
    ],
    solution: {
      py: `def isPalindrome(s):
    l, r = 0, len(s) - 1
    while l < r:
        while l < r and not s[l].isalnum():
            l += 1
        while l < r and not s[r].isalnum():
            r -= 1
        if s[l].lower() != s[r].lower():
            return False
        l += 1
        r -= 1
    return True`,
      js: `function isPalindrome(s) {
    const ok = (c) => /[\\p{L}\\p{N}]/u.test(c)
    let l = 0, r = s.length - 1
    while (l < r) {
        while (l < r && !ok(s[l])) l++
        while (l < r && !ok(s[r])) r--
        if (s[l].toLowerCase() !== s[r].toLowerCase()) return false
        l++
        r--
    }
    return true
}`,
    },
    explanation: `Два указателя с концов, пропускаем всё, что не буква и не цифра, сравниваем символы без учёта регистра. Можно сначала отфильтровать строку и сравнить с развёрнутой, но это O(n) доп. памяти.

Обратите внимание на Unicode: в JS \`/\\w/\` не знает кириллицу, нужен класс \`\\p{L}\` с флагом \`u\`. В Python \`str.isalnum()\` работает с любыми алфавитами.

**Сложность:** O(n) времени, O(1) памяти.`,
    hints: ['Сравнивайте символы с двух концов.', 'Не забудьте про кириллицу и регистр.'],
  },
  {
    id: 'ranges-compress',
    title: 'Свернуть числа в диапазоны',
    difficulty: 'easy',
    pattern: 'Массивы и строки',
    topic: 'algo-arrays',
    companies: ['vk'],
    statement: `Дан массив неотрицательных целых чисел (возможны повторы, порядок произвольный). Верните строку, в которой подряд идущие числа свёрнуты в диапазоны через дефис, а группы разделены запятыми, в порядке возрастания.

Пример: \`[1, 4, 5, 2, 3, 9, 8, 11, 0]\` → \`"0-5,8-9,11"\`. Для пустого массива верните пустую строку.`,
    fn: 'compress',
    params: ['nums'],
    tests: [
      { args: [[1, 4, 5, 2, 3, 9, 8, 11, 0]], expected: '0-5,8-9,11' },
      { args: [[1, 4, 3, 2]], expected: '1-4' },
      { args: [[1, 4]], expected: '1,4' },
      { args: [[]], expected: '' },
      { args: [[5, 5, 6, 6, 8]], expected: '5-6,8' },
      { args: [[10]], expected: '10' },
    ],
    solution: {
      py: `def compress(nums):
    xs = sorted(set(nums))
    parts = []
    i = 0
    while i < len(xs):
        j = i
        while j + 1 < len(xs) and xs[j + 1] == xs[j] + 1:
            j += 1
        parts.append(str(xs[i]) if i == j else f"{xs[i]}-{xs[j]}")
        i = j + 1
    return ",".join(parts)`,
      js: `function compress(nums) {
    const xs = [...new Set(nums)].sort((a, b) => a - b)
    const parts = []
    let i = 0
    while (i < xs.length) {
        let j = i
        while (j + 1 < xs.length && xs[j + 1] === xs[j] + 1) j++
        parts.push(i === j ? String(xs[i]) : \`\${xs[i]}-\${xs[j]}\`)
        i = j + 1
    }
    return parts.join(',')
}`,
    },
    explanation: `Убираем дубликаты, сортируем и идём группами: пока следующее число на единицу больше текущего — расширяем группу. Группа из одного числа печатается без дефиса.

Типичные ошибки: забыть про дубликаты, сортировать числа как строки (в JS \`sort()\` без компаратора сортирует лексикографически: \`[10, 9]\` останется как есть) и потерять последнюю группу.

**Сложность:** O(n log n) из-за сортировки.`,
    hints: ['Сначала отсортируйте и уберите повторы.', 'В JS sort() без компаратора сравнивает строки.'],
  },
  {
    id: 'rle',
    title: 'Сжатие строки RLE',
    difficulty: 'easy',
    pattern: 'Массивы и строки',
    topic: 'algo-arrays',
    companies: ['avito'],
    statement: `Сожмите строку из заглавных латинских букв алгоритмом Run-Length Encoding: каждую группу одинаковых подряд идущих символов замените на символ и длину группы. Если группа из одного символа, число не пишется.

\`"AAABBC"\` → \`"A3B2C"\`, \`"ABC"\` → \`"ABC"\`.`,
    fn: 'rle',
    params: ['s'],
    tests: [
      { args: ['AAABBC'], expected: 'A3B2C' },
      { args: ['ABC'], expected: 'ABC' },
      { args: [''], expected: '' },
      { args: ['AAAAAAAAAAAA'], expected: 'A12' },
      { args: ['AABBA'], expected: 'A2B2A' },
    ],
    solution: {
      py: `def rle(s):
    out = []
    i = 0
    while i < len(s):
        j = i
        while j < len(s) and s[j] == s[i]:
            j += 1
        out.append(s[i] + (str(j - i) if j - i > 1 else ""))
        i = j
    return "".join(out)`,
      js: `function rle(s) {
    const out = []
    let i = 0
    while (i < s.length) {
        let j = i
        while (j < s.length && s[j] === s[i]) j++
        out.push(s[i] + (j - i > 1 ? j - i : ''))
        i = j
    }
    return out.join('')
}`,
    },
    explanation: `Проходим строку группами: \`j\` бежит, пока символ совпадает с началом группы. Длина группы — \`j - i\`. Результат собираем в список и соединяем один раз — конкатенация строк в цикле может быть квадратичной.

**Сложность:** O(n).`,
    hints: ['Обрабатывайте строку группами одинаковых символов.'],
  },
  {
    id: 'max-water',
    title: 'Контейнер с наибольшим объёмом воды',
    difficulty: 'medium',
    pattern: 'Два указателя',
    topic: 'algo-arrays',
    statement: `Дан массив \`h\` высот вертикальных линий, стоящих в точках 0, 1, …, n−1. Две линии вместе с осью образуют контейнер. Найдите максимальную площадь воды: \`min(h[i], h[j]) * (j - i)\`.

Нужно решение за O(n).`,
    fn: 'maxArea',
    params: ['h'],
    tests: [
      { args: [[1, 8, 6, 2, 5, 4, 8, 3, 7]], expected: 49 },
      { args: [[1, 1]], expected: 1 },
      { args: [[4, 3, 2, 1, 4]], expected: 16 },
      { args: [[1, 2, 1]], expected: 2 },
      { args: [[5]], expected: 0 },
    ],
    solution: {
      py: `def maxArea(h):
    l, r = 0, len(h) - 1
    best = 0
    while l < r:
        best = max(best, min(h[l], h[r]) * (r - l))
        if h[l] < h[r]:
            l += 1
        else:
            r -= 1
    return best`,
      js: `function maxArea(h) {
    let l = 0, r = h.length - 1, best = 0
    while (l < r) {
        best = Math.max(best, Math.min(h[l], h[r]) * (r - l))
        if (h[l] < h[r]) l++
        else r--
    }
    return best
}`,
    },
    explanation: `Начинаем с самого широкого контейнера. Площадь ограничена меньшей стенкой. Если сдвинуть большую стенку, ширина уменьшится, а высота не вырастет — выгоды нет. Поэтому двигаем меньшую: только так можно найти большую площадь.

**Сложность:** O(n) времени, O(1) памяти.`,
    hints: ['Начните с крайних линий.', 'Какую из двух стенок бессмысленно двигать?'],
  },
  {
    id: 'three-sum',
    title: 'Тройки с нулевой суммой',
    difficulty: 'medium',
    pattern: 'Два указателя',
    topic: 'algo-arrays',
    compare: 'unordered-nested',
    statement: `Найдите все **уникальные** тройки чисел массива с суммой 0. Порядок троек и порядок чисел внутри тройки не важен, одинаковых троек быть не должно.

Нужно решение за O(n²).`,
    fn: 'threeSum',
    params: ['nums'],
    tests: [
      { args: [[-1, 0, 1, 2, -1, -4]], expected: [[-1, -1, 2], [-1, 0, 1]] },
      { args: [[0, 1, 1]], expected: [] },
      { args: [[0, 0, 0, 0]], expected: [[0, 0, 0]] },
      { args: [[-2, 0, 1, 1, 2]], expected: [[-2, 0, 2], [-2, 1, 1]] },
      { args: [[]], expected: [] },
    ],
    solution: {
      py: `def threeSum(nums):
    nums.sort()
    res = []
    n = len(nums)
    for i in range(n - 2):
        if i and nums[i] == nums[i - 1]:
            continue
        l, r = i + 1, n - 1
        while l < r:
            s = nums[i] + nums[l] + nums[r]
            if s < 0:
                l += 1
            elif s > 0:
                r -= 1
            else:
                res.append([nums[i], nums[l], nums[r]])
                while l < r and nums[l] == nums[l + 1]:
                    l += 1
                l += 1
                r -= 1
    return res`,
      js: `function threeSum(nums) {
    nums.sort((a, b) => a - b)
    const res = []
    for (let i = 0; i < nums.length - 2; i++) {
        if (i && nums[i] === nums[i - 1]) continue
        let l = i + 1, r = nums.length - 1
        while (l < r) {
            const s = nums[i] + nums[l] + nums[r]
            if (s < 0) l++
            else if (s > 0) r--
            else {
                res.push([nums[i], nums[l], nums[r]])
                while (l < r && nums[l] === nums[l + 1]) l++
                l++
                r--
            }
        }
    }
    return res
}`,
    },
    explanation: `Сортируем. Фиксируем первый элемент \`i\` и ищем пару с суммой \`-nums[i]\` двумя указателями на оставшейся части. Дубликаты убираем двумя пропусками: одинаковые \`nums[i]\` подряд и одинаковые \`nums[l]\` после найденной тройки.

**Сложность:** O(n²) времени, O(1) доп. памяти (не считая ответа и сортировки).`,
    hints: ['Отсортируйте массив и зафиксируйте первый элемент тройки.', 'Для остальных двух — задача о паре с суммой в отсортированном массиве.'],
  },
  {
    id: 'merge-sorted',
    title: 'Слияние двух отсортированных массивов',
    difficulty: 'easy',
    pattern: 'Два указателя',
    topic: 'algo-arrays',
    statement: `Даны два массива, отсортированных по неубыванию. Верните один отсортированный массив из всех элементов. Не используйте встроенную сортировку — решите за O(n + m).`,
    fn: 'mergeSorted',
    params: ['a', 'b'],
    tests: [
      { args: [[1, 3, 5], [2, 4, 6]], expected: [1, 2, 3, 4, 5, 6] },
      { args: [[], [1]], expected: [1] },
      { args: [[1, 1], [1]], expected: [1, 1, 1] },
      { args: [[-2, 10], [0, 0, 20]], expected: [-2, 0, 0, 10, 20] },
      { args: [[], []], expected: [] },
    ],
    solution: {
      py: `def mergeSorted(a, b):
    i = j = 0
    out = []
    while i < len(a) and j < len(b):
        if a[i] <= b[j]:
            out.append(a[i]); i += 1
        else:
            out.append(b[j]); j += 1
    out.extend(a[i:])
    out.extend(b[j:])
    return out`,
      js: `function mergeSorted(a, b) {
    let i = 0, j = 0
    const out = []
    while (i < a.length && j < b.length) out.push(a[i] <= b[j] ? a[i++] : b[j++])
    while (i < a.length) out.push(a[i++])
    while (j < b.length) out.push(b[j++])
    return out
}`,
    },
    explanation: `Классический шаг сортировки слиянием: сравниваем головы массивов и берём меньшую. Когда один массив закончился, дописываем хвост другого. Знак \`<=\` делает слияние устойчивым.

**Сложность:** O(n + m).`,
    hints: ['Сравнивайте текущие элементы двух массивов.'],
  },
  {
    id: 'cinema-seat',
    title: 'Место в кинотеатре подальше от всех',
    difficulty: 'medium',
    pattern: 'Массивы и строки',
    topic: 'algo-arrays',
    companies: ['vk'],
    statement: `Ряд в кинотеатре задан массивом из 0 и 1: 1 — место занято, 0 — свободно. Хотя бы одно место занято и хотя бы одно свободно. Зритель хочет сесть так, чтобы расстояние до **ближайшего** соседа было максимальным. Верните это максимальное расстояние.

\`[1,0,0,0,1,0,1]\` → 2 (сесть на место 2).`,
    fn: 'maxDistToClosest',
    params: ['seats'],
    tests: [
      { args: [[1, 0, 0, 0, 1, 0, 1]], expected: 2 },
      { args: [[1, 0, 0, 0]], expected: 3 },
      { args: [[0, 1]], expected: 1 },
      { args: [[0, 0, 1, 0, 0, 0, 0, 1]], expected: 2 },
      { args: [[1, 0, 1]], expected: 1 },
      { args: [[0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1]], expected: 3 },
    ],
    solution: {
      py: `def maxDistToClosest(seats):
    n = len(seats)
    prev = -1
    best = 0
    for i, s in enumerate(seats):
        if s == 1:
            if prev == -1:
                best = i
            else:
                best = max(best, (i - prev) // 2)
            prev = i
    return max(best, n - 1 - prev)`,
      js: `function maxDistToClosest(seats) {
    const n = seats.length
    let prev = -1, best = 0
    for (let i = 0; i < n; i++) {
        if (seats[i] === 1) {
            best = prev === -1 ? i : Math.max(best, Math.floor((i - prev) / 2))
            prev = i
        }
    }
    return Math.max(best, n - 1 - prev)
}`,
    },
    explanation: `Три случая: свободные места в начале ряда (садимся на край — расстояние равно индексу первого зрителя), в конце ряда (аналогично) и между двумя зрителями (садимся в середину — расстояние равно половине промежутка, округлённой вниз). Один проход с запоминанием предыдущего занятого места.

Ловушка — забыть про края: для \`[1,0,0,0]\` ответ 3, а не 1.

**Сложность:** O(n) времени, O(1) памяти.`,
    hints: ['Рассмотрите отдельно края ряда и промежутки между зрителями.'],
  },
  {
    id: 'rotate-array',
    title: 'Циклический сдвиг массива',
    difficulty: 'medium',
    pattern: 'Массивы и строки',
    topic: 'algo-arrays',
    statement: `Сдвиньте массив циклически вправо на \`k\` позиций и верните его. \`k\` может быть больше длины массива. Попробуйте решить на месте с O(1) доп. памяти.

\`[1,2,3,4,5,6,7], k = 3\` → \`[5,6,7,1,2,3,4]\`.`,
    fn: 'rotate',
    params: ['nums', 'k'],
    tests: [
      { args: [[1, 2, 3, 4, 5, 6, 7], 3], expected: [5, 6, 7, 1, 2, 3, 4] },
      { args: [[-1, -100, 3, 99], 2], expected: [3, 99, -1, -100] },
      { args: [[1, 2], 5], expected: [2, 1] },
      { args: [[1], 0], expected: [1] },
      { args: [[], 3], expected: [] },
    ],
    solution: {
      py: `def rotate(nums, k):
    n = len(nums)
    if n == 0:
        return nums
    k %= n
    def rev(l, r):
        while l < r:
            nums[l], nums[r] = nums[r], nums[l]
            l += 1; r -= 1
    rev(0, n - 1)
    rev(0, k - 1)
    rev(k, n - 1)
    return nums`,
      js: `function rotate(nums, k) {
    const n = nums.length
    if (!n) return nums
    k %= n
    const rev = (l, r) => { while (l < r) { [nums[l], nums[r]] = [nums[r], nums[l]]; l++; r-- } }
    rev(0, n - 1)
    rev(0, k - 1)
    rev(k, n - 1)
    return nums
}`,
    },
    explanation: `Трюк с тремя разворотами: развернуть весь массив — последние \`k\` элементов окажутся в начале, но в обратном порядке. Разворачиваем первые \`k\` и оставшиеся \`n − k\` по отдельности. Не забудьте \`k %= n\` и пустой массив (деление на ноль).

**Сложность:** O(n) времени, O(1) памяти.`,
    hints: ['Что станет с массивом, если его развернуть целиком?'],
  },
  {
    id: 'power-of-two',
    title: 'Степень двойки',
    difficulty: 'easy',
    pattern: 'Битовые операции',
    topic: 'algo-arrays',
    companies: ['ozon'],
    statement: `Проверьте, является ли целое число \`n\` степенью двойки (1, 2, 4, 8, …). Решите за O(1) без циклов.`,
    fn: 'isPowerOfTwo',
    params: ['n'],
    tests: [
      { args: [1], expected: true },
      { args: [16], expected: true },
      { args: [3], expected: false },
      { args: [0], expected: false },
      { args: [-8], expected: false },
      { args: [1073741824], expected: true },
      { args: [1073741823], expected: false },
    ],
    solution: {
      py: `def isPowerOfTwo(n):
    return n > 0 and n & (n - 1) == 0`,
      js: `function isPowerOfTwo(n) {
    return n > 0 && (n & (n - 1)) === 0
}`,
    },
    explanation: `У степени двойки в двоичной записи ровно одна единица. Вычитание единицы превращает её в ноль, а все нули справа — в единицы: \`1000 − 1 = 0111\`. Побитовое И даёт 0 только для степеней двойки. Отдельно отсекаем \`n ≤ 0\`.

В JS обратите внимание на приоритет: \`n & (n - 1) === 0\` без скобок сначала сравнит \`(n - 1) === 0\`.

**Сложность:** O(1).`,
    hints: ['Посмотрите на двоичную запись степеней двойки и числа на единицу меньше.'],
  },
  {
    id: 'monotonic',
    title: 'Монотонный массив',
    difficulty: 'easy',
    pattern: 'Массивы и строки',
    topic: 'algo-arrays',
    companies: ['ozon'],
    statement: `Массив называется монотонным, если он целиком неубывающий или целиком невозрастающий. Проверьте, монотонен ли массив, за один проход.`,
    fn: 'isMonotonic',
    params: ['nums'],
    tests: [
      { args: [[1, 2, 2, 3]], expected: true },
      { args: [[6, 5, 4, 4]], expected: true },
      { args: [[1, 3, 2]], expected: false },
      { args: [[]], expected: true },
      { args: [[5, 5, 5]], expected: true },
      { args: [[1, 1, 0, 2]], expected: false },
    ],
    solution: {
      py: `def isMonotonic(nums):
    inc = dec = True
    for i in range(1, len(nums)):
        if nums[i] > nums[i - 1]:
            dec = False
        if nums[i] < nums[i - 1]:
            inc = False
    return inc or dec`,
      js: `function isMonotonic(nums) {
    let inc = true, dec = true
    for (let i = 1; i < nums.length; i++) {
        if (nums[i] > nums[i - 1]) dec = false
        if (nums[i] < nums[i - 1]) inc = false
    }
    return inc || dec
}`,
    },
    explanation: `Держим два флага: «может быть неубывающим» и «может быть невозрастающим». Каждый рост снимает второй флаг, каждое падение — первый. Равные соседи ни на что не влияют.

**Сложность:** O(n).`,
    hints: ['Отслеживайте сразу обе гипотезы.'],
  },
  {
    id: 'two-sum',
    title: 'Две суммы',
    difficulty: 'easy',
    pattern: 'Хеш-таблицы',
    topic: 'algo-hash',
    statement: `Дан массив \`nums\` и число \`target\`. Верните индексы \`[i, j]\` (\`i < j\`) двух элементов с суммой \`target\`. Гарантируется, что ответ ровно один. Массив не отсортирован. Нужно решение за O(n).`,
    fn: 'twoSum',
    params: ['nums', 'target'],
    tests: [
      { args: [[2, 7, 11, 15], 9], expected: [0, 1] },
      { args: [[3, 2, 4], 6], expected: [1, 2] },
      { args: [[3, 3], 6], expected: [0, 1] },
      { args: [[-3, 4, 3, 90], 0], expected: [0, 2] },
      { args: [[1, 5, 2, 9], 10], expected: [0, 3] },
    ],
    solution: {
      py: `def twoSum(nums, target):
    seen = {}
    for i, x in enumerate(nums):
        if target - x in seen:
            return [seen[target - x], i]
        seen[x] = i
    return []`,
      js: `function twoSum(nums, target) {
    const seen = new Map()
    for (let i = 0; i < nums.length; i++) {
        if (seen.has(target - nums[i])) return [seen.get(target - nums[i]), i]
        seen.set(nums[i], i)
    }
    return []
}`,
    },
    explanation: `Для каждого числа \`x\` ищем в словаре дополнение \`target − x\` среди уже просмотренных. Проверка до добавления текущего элемента защищает от использования одного элемента дважды (случай \`[3, 3]\` работает, потому что первое 3 уже лежит в словаре).

**Сложность:** O(n) времени и памяти. Наивный перебор пар — O(n²).`,
    hints: ['Что нужно знать о предыдущих элементах, чтобы сразу найти пару для текущего?'],
  },
  {
    id: 'first-unique',
    title: 'Первый неповторяющийся символ',
    difficulty: 'easy',
    pattern: 'Хеш-таблицы',
    topic: 'algo-hash',
    statement: `Верните индекс первого символа строки, который встречается в ней ровно один раз. Если такого нет — верните -1.`,
    fn: 'firstUniqChar',
    params: ['s'],
    tests: [
      { args: ['leetcode'], expected: 0 },
      { args: ['loveleetcode'], expected: 2 },
      { args: ['aabb'], expected: -1 },
      { args: [''], expected: -1 },
      { args: ['ооп'], expected: 2 },
    ],
    solution: {
      py: `from collections import Counter

def firstUniqChar(s):
    cnt = Counter(s)
    for i, ch in enumerate(s):
        if cnt[ch] == 1:
            return i
    return -1`,
      js: `function firstUniqChar(s) {
    const cnt = new Map()
    for (const ch of s) cnt.set(ch, (cnt.get(ch) || 0) + 1)
    for (let i = 0; i < s.length; i++) if (cnt.get(s[i]) === 1) return i
    return -1
}`,
    },
    explanation: `Два прохода: сначала считаем частоты символов, затем ищем первый с частотой 1. Попытка сделать это одним проходом без подсчёта обычно приводит к O(n²).

**Сложность:** O(n) времени, O(алфавита) памяти.`,
    hints: ['Сначала посчитайте, сколько раз встречается каждый символ.'],
  },
  {
    id: 'valid-anagram',
    title: 'Анаграммы',
    difficulty: 'easy',
    pattern: 'Хеш-таблицы',
    topic: 'algo-hash',
    statement: `Проверьте, является ли строка \`t\` анаграммой строки \`s\` — то есть состоит из тех же символов в том же количестве.`,
    fn: 'isAnagram',
    params: ['s', 't'],
    tests: [
      { args: ['anagram', 'nagaram'], expected: true },
      { args: ['rat', 'car'], expected: false },
      { args: ['', ''], expected: true },
      { args: ['ab', 'a'], expected: false },
      { args: ['кот', 'ток'], expected: true },
    ],
    solution: {
      py: `from collections import Counter

def isAnagram(s, t):
    return len(s) == len(t) and Counter(s) == Counter(t)`,
      js: `function isAnagram(s, t) {
    if (s.length !== t.length) return false
    const cnt = new Map()
    for (const ch of s) cnt.set(ch, (cnt.get(ch) || 0) + 1)
    for (const ch of t) {
        const c = cnt.get(ch)
        if (!c) return false
        cnt.set(ch, c - 1)
    }
    return true
}`,
    },
    explanation: `Сравниваем счётчики символов. Проверка длин в начале — дешёвый ранний выход. Альтернатива — сравнить отсортированные строки, но это O(n log n).

**Сложность:** O(n).`,
    hints: ['Посчитайте частоты символов.'],
  },
  {
    id: 'group-anagrams',
    title: 'Сгруппировать анаграммы',
    difficulty: 'medium',
    pattern: 'Хеш-таблицы',
    topic: 'algo-hash',
    compare: 'unordered-nested',
    statement: `Сгруппируйте слова так, чтобы в каждой группе были анаграммы друг друга. Порядок групп и слов внутри групп не важен.`,
    fn: 'groupAnagrams',
    params: ['words'],
    tests: [
      { args: [['eat', 'tea', 'tan', 'ate', 'nat', 'bat']], expected: [['bat'], ['nat', 'tan'], ['ate', 'eat', 'tea']] },
      { args: [['']], expected: [['']] },
      { args: [['a']], expected: [['a']] },
      { args: [['ab', 'ba', 'abc', 'cab', 'x']], expected: [['ab', 'ba'], ['abc', 'cab'], ['x']] },
    ],
    solution: {
      py: `from collections import defaultdict

def groupAnagrams(words):
    groups = defaultdict(list)
    for w in words:
        groups["".join(sorted(w))].append(w)
    return list(groups.values())`,
      js: `function groupAnagrams(words) {
    const groups = new Map()
    for (const w of words) {
        const key = [...w].sort().join('')
        if (!groups.has(key)) groups.set(key, [])
        groups.get(key).push(w)
    }
    return [...groups.values()]
}`,
    },
    explanation: `У всех анаграмм одинаковый «канонический вид» — отсортированные буквы. Используем его как ключ словаря. Для длинных слов ключ можно строить за O(L) из счётчика 26 букв.

**Сложность:** O(n · L log L).`,
    hints: ['Какой общий ключ есть у всех анаграмм одного слова?'],
  },
  {
    id: 'longest-consecutive',
    title: 'Самая длинная последовательность подряд идущих чисел',
    difficulty: 'medium',
    pattern: 'Хеш-таблицы',
    topic: 'algo-hash',
    statement: `Дан неотсортированный массив целых чисел. Найдите длину самой длинной последовательности подряд идущих чисел (например, 1, 2, 3, 4), которые встречаются в массиве. Нужно решение за O(n) — без сортировки.`,
    fn: 'longestConsecutive',
    params: ['nums'],
    tests: [
      { args: [[100, 4, 200, 1, 3, 2]], expected: 4 },
      { args: [[0, 3, 7, 2, 5, 8, 4, 6, 0, 1]], expected: 9 },
      { args: [[]], expected: 0 },
      { args: [[1, 2, 0, 1]], expected: 3 },
      { args: [[-1, -2, 5]], expected: 2 },
    ],
    solution: {
      py: `def longestConsecutive(nums):
    s = set(nums)
    best = 0
    for x in s:
        if x - 1 not in s:
            y = x
            while y + 1 in s:
                y += 1
            best = max(best, y - x + 1)
    return best`,
      js: `function longestConsecutive(nums) {
    const s = new Set(nums)
    let best = 0
    for (const x of s) {
        if (!s.has(x - 1)) {
            let y = x
            while (s.has(y + 1)) y++
            best = Math.max(best, y - x + 1)
        }
    }
    return best
}`,
    },
    explanation: `Кладём числа во множество. Последовательность начинаем считать только от её начала — числа \`x\`, для которого \`x − 1\` нет во множестве. Тогда каждое число просматривается во внутреннем цикле не больше одного раза, и суммарно получается O(n).

**Сложность:** O(n) времени и памяти.`,
    hints: ['Множество даёт проверку «есть ли число» за O(1).', 'С какого числа имеет смысл начинать считать последовательность?'],
  },
  {
    id: 'subarray-sum-k',
    title: 'Количество подмассивов с суммой k',
    difficulty: 'medium',
    pattern: 'Префиксные суммы и окно',
    topic: 'algo-hash',
    statement: `Посчитайте, сколько непрерывных подмассивов имеют сумму ровно \`k\`. Числа могут быть отрицательными. Нужно решение за O(n).`,
    fn: 'subarraySum',
    params: ['nums', 'k'],
    tests: [
      { args: [[1, 1, 1], 2], expected: 2 },
      { args: [[1, 2, 3], 3], expected: 2 },
      { args: [[1, -1, 0], 0], expected: 3 },
      { args: [[], 0], expected: 0 },
      { args: [[3, 4, 7, 2, -3, 1, 4, 2], 7], expected: 4 },
    ],
    solution: {
      py: `def subarraySum(nums, k):
    count = {0: 1}
    s = ans = 0
    for x in nums:
        s += x
        ans += count.get(s - k, 0)
        count[s] = count.get(s, 0) + 1
    return ans`,
      js: `function subarraySum(nums, k) {
    const count = new Map([[0, 1]])
    let s = 0, ans = 0
    for (const x of nums) {
        s += x
        ans += count.get(s - k) || 0
        count.set(s, (count.get(s) || 0) + 1)
    }
    return ans
}`,
    },
    explanation: `Сумма подмассива \`(l, r]\` равна \`pref[r] − pref[l]\`. Значит, для текущей префиксной суммы \`s\` нужно знать, сколько раньше встречалось префиксов, равных \`s − k\`. Храним их частоты в словаре. Начальная запись \`{0: 1}\` учитывает подмассивы, начинающиеся с нулевого индекса.

Скользящее окно здесь не работает из-за отрицательных чисел.

**Сложность:** O(n).`,
    hints: ['Выразите сумму подмассива через префиксные суммы.', 'Что нужно хранить о предыдущих префиксах?'],
  },
  {
    id: 'top-k-frequent',
    title: 'k самых частых элементов',
    difficulty: 'medium',
    pattern: 'Куча',
    topic: 'algo-heap',
    compare: 'unordered',
    statement: `Верните \`k\` самых частых элементов массива. Гарантируется, что ответ однозначен. Порядок элементов в ответе не важен. Решите быстрее, чем O(n log n).`,
    fn: 'topKFrequent',
    params: ['nums', 'k'],
    tests: [
      { args: [[1, 1, 1, 2, 2, 3], 2], expected: [1, 2] },
      { args: [[1], 1], expected: [1] },
      { args: [[4, 4, 5, 5, 5, 6, 6, 6, 6], 2], expected: [5, 6] },
      { args: [[-1, -1, 2], 1], expected: [-1] },
    ],
    solution: {
      py: `from collections import Counter

def topKFrequent(nums, k):
    cnt = Counter(nums)
    buckets = [[] for _ in range(len(nums) + 1)]
    for x, c in cnt.items():
        buckets[c].append(x)
    res = []
    for c in range(len(nums), 0, -1):
        for x in buckets[c]:
            res.append(x)
            if len(res) == k:
                return res
    return res`,
      js: `function topKFrequent(nums, k) {
    const cnt = new Map()
    for (const x of nums) cnt.set(x, (cnt.get(x) || 0) + 1)
    const buckets = Array.from({ length: nums.length + 1 }, () => [])
    for (const [x, c] of cnt) buckets[c].push(x)
    const res = []
    for (let c = nums.length; c > 0 && res.length < k; c--) {
        for (const x of buckets[c]) {
            res.push(x)
            if (res.length === k) break
        }
    }
    return res
}`,
    },
    explanation: `Считаем частоты. Дальше два варианта:
- **Куча размера k** по частоте — O(n log k).
- **Корзины по частоте** — частота не превышает n, поэтому кладём элементы в массив корзин и идём от больших частот к меньшим. O(n).

**Сложность:** O(n) для корзин, O(n log k) для кучи.`,
    hints: ['Посчитайте частоты.', 'Частота не может быть больше n — можно ли отсортировать без сравнений?'],
  },
  {
    id: 'merge-intervals',
    title: 'Слияние отрезков',
    difficulty: 'medium',
    pattern: 'Сортировка',
    topic: 'algo-sorting',
    statement: `Дан список отрезков \`[start, end]\`. Слейте все пересекающиеся (касающиеся тоже: \`[1,3]\` и \`[3,5]\` → \`[1,5]\`) и верните результат, отсортированный по началу.`,
    fn: 'merge',
    params: ['intervals'],
    tests: [
      { args: [[[1, 3], [2, 6], [8, 10], [15, 18]]], expected: [[1, 6], [8, 10], [15, 18]] },
      { args: [[[1, 4], [4, 5]]], expected: [[1, 5]] },
      { args: [[[1, 4], [0, 4]]], expected: [[0, 4]] },
      { args: [[[1, 10], [2, 3], [4, 5]]], expected: [[1, 10]] },
      { args: [[]], expected: [] },
    ],
    solution: {
      py: `def merge(intervals):
    intervals.sort(key=lambda x: x[0])
    res = []
    for s, e in intervals:
        if res and s <= res[-1][1]:
            res[-1][1] = max(res[-1][1], e)
        else:
            res.append([s, e])
    return res`,
      js: `function merge(intervals) {
    intervals.sort((a, b) => a[0] - b[0])
    const res = []
    for (const [s, e] of intervals) {
        if (res.length && s <= res[res.length - 1][1]) res[res.length - 1][1] = Math.max(res[res.length - 1][1], e)
        else res.push([s, e])
    }
    return res
}`,
    },
    explanation: `После сортировки по началу пересекающиеся отрезки стоят подряд. Идём слева направо и держим последний объединённый отрезок: если новый начинается не позже его конца — расширяем конец через \`max\` (вложенный отрезок не должен уменьшить конец), иначе начинаем новый.

**Сложность:** O(n log n).`,
    hints: ['Отсортируйте по началу.', 'Не забудьте случай, когда один отрезок целиком внутри другого.'],
  },
  {
    id: 'largest-number',
    title: 'Наибольшее число из массива',
    difficulty: 'medium',
    pattern: 'Сортировка',
    topic: 'algo-sorting',
    statement: `Дан массив неотрицательных целых чисел. Расставьте их так, чтобы при записи подряд получилось наибольшее число, и верните его строкой. Ответ без ведущих нулей (\`[0, 0]\` → \`"0"\`).`,
    fn: 'largestNumber',
    params: ['nums'],
    tests: [
      { args: [[10, 2]], expected: '210' },
      { args: [[3, 30, 34, 5, 9]], expected: '9534330' },
      { args: [[0, 0]], expected: '0' },
      { args: [[1]], expected: '1' },
      { args: [[121, 12]], expected: '12121' },
    ],
    solution: {
      py: `from functools import cmp_to_key

def largestNumber(nums):
    xs = list(map(str, nums))
    xs.sort(key=cmp_to_key(lambda a, b: -1 if a + b > b + a else (1 if a + b < b + a else 0)))
    res = "".join(xs)
    return "0" if res and res[0] == "0" else res`,
      js: `function largestNumber(nums) {
    const xs = nums.map(String).sort((a, b) => (b + a).localeCompare(a + b))
    const res = xs.join('')
    return res[0] === '0' ? '0' : res
}`,
    },
    explanation: `Нужен свой компаратор: \`a\` должно идти раньше \`b\`, если \`a + b > b + a\` как строки. Например, для 3 и 30: «330» > «303», значит 3 раньше 30. Такое сравнение транзитивно, поэтому сортировка корректна. Отдельно обрабатываем ответ из одних нулей.

**Сложность:** O(n log n · L).`,
    hints: ['Сравнение чисел как строк напрямую не работает: 3 и 30.', 'Сравните две склейки: a+b и b+a.'],
  },
  {
    id: 'can-attend',
    title: 'Можно ли посетить все встречи',
    difficulty: 'easy',
    pattern: 'Сортировка',
    topic: 'algo-sorting',
    statement: `Даны встречи \`[start, end)\`. Проверьте, может ли один человек посетить все — то есть никакие две встречи не пересекаются. Встреча, заканчивающаяся в момент начала другой, не пересекается с ней.`,
    fn: 'canAttend',
    params: ['meetings'],
    tests: [
      { args: [[[0, 30], [5, 10], [15, 20]]], expected: false },
      { args: [[[7, 10], [2, 4]]], expected: true },
      { args: [[[1, 5], [5, 8]]], expected: true },
      { args: [[]], expected: true },
    ],
    solution: {
      py: `def canAttend(meetings):
    meetings.sort()
    for i in range(1, len(meetings)):
        if meetings[i][0] < meetings[i - 1][1]:
            return False
    return True`,
      js: `function canAttend(meetings) {
    meetings.sort((a, b) => a[0] - b[0])
    for (let i = 1; i < meetings.length; i++) if (meetings[i][0] < meetings[i - 1][1]) return false
    return true
}`,
    },
    explanation: `Сортируем по началу и проверяем соседей: если следующая встреча начинается раньше, чем закончилась предыдущая, — пересечение. Сравнивать все пары не нужно.

**Сложность:** O(n log n).`,
    hints: ['После сортировки достаточно сравнить соседние встречи.'],
  },
  {
    id: 'sort-colors',
    title: 'Сортировка трёх цветов',
    difficulty: 'medium',
    pattern: 'Сортировка',
    topic: 'algo-sorting',
    statement: `Массив состоит из 0, 1 и 2. Отсортируйте его за **один проход** без встроенной сортировки и без подсчёта (задача о флаге Нидерландов). Верните массив.`,
    fn: 'sortColors',
    params: ['nums'],
    tests: [
      { args: [[2, 0, 2, 1, 1, 0]], expected: [0, 0, 1, 1, 2, 2] },
      { args: [[2, 0, 1]], expected: [0, 1, 2] },
      { args: [[0]], expected: [0] },
      { args: [[2, 2, 2, 0]], expected: [0, 2, 2, 2] },
      { args: [[]], expected: [] },
    ],
    solution: {
      py: `def sortColors(nums):
    lo, mid, hi = 0, 0, len(nums) - 1
    while mid <= hi:
        if nums[mid] == 0:
            nums[lo], nums[mid] = nums[mid], nums[lo]
            lo += 1; mid += 1
        elif nums[mid] == 1:
            mid += 1
        else:
            nums[mid], nums[hi] = nums[hi], nums[mid]
            hi -= 1
    return nums`,
      js: `function sortColors(nums) {
    let lo = 0, mid = 0, hi = nums.length - 1
    while (mid <= hi) {
        if (nums[mid] === 0) { [nums[lo], nums[mid]] = [nums[mid], nums[lo]]; lo++; mid++ }
        else if (nums[mid] === 1) mid++
        else { [nums[mid], nums[hi]] = [nums[hi], nums[mid]]; hi-- }
    }
    return nums
}`,
    },
    explanation: `Три указателя делят массив на зоны: \`[0, lo)\` — нули, \`[lo, mid)\` — единицы, \`(hi, n)\` — двойки, \`[mid, hi]\` — ещё не просмотрено. Ноль меняем с началом зоны единиц, двойку — с концом непросмотренной зоны (и не двигаем \`mid\`: пришедший элемент ещё не проверен).

**Сложность:** O(n), один проход, O(1) памяти.`,
    hints: ['Заведите три границы: конец нулей, текущий элемент, начало двоек.'],
  },
  {
    id: 'binary-search',
    title: 'Бинарный поиск',
    difficulty: 'easy',
    pattern: 'Бинарный поиск',
    topic: 'algo-binsearch',
    statement: `Дан отсортированный по возрастанию массив различных чисел и число \`target\`. Верните индекс \`target\` или -1, если его нет. Решите за O(log n).`,
    fn: 'search',
    params: ['nums', 'target'],
    tests: [
      { args: [[-1, 0, 3, 5, 9, 12], 9], expected: 4 },
      { args: [[-1, 0, 3, 5, 9, 12], 2], expected: -1 },
      { args: [[5], 5], expected: 0 },
      { args: [[], 1], expected: -1 },
      { args: [[1, 3], 3], expected: 1 },
      { args: [[1, 3], 0], expected: -1 },
    ],
    solution: {
      py: `def search(nums, target):
    lo, hi = 0, len(nums) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if nums[mid] == target:
            return mid
        if nums[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1`,
      js: `function search(nums, target) {
    let lo = 0, hi = nums.length - 1
    while (lo <= hi) {
        const mid = lo + ((hi - lo) >> 1)
        if (nums[mid] === target) return mid
        if (nums[mid] < target) lo = mid + 1
        else hi = mid - 1
    }
    return -1
}`,
    },
    explanation: `Классика на закрытом интервале \`[lo, hi]\`: цикл, пока \`lo <= hi\`, и сдвиг границ за \`mid\`. Главное — выбрать один стиль границ и не смешивать. В языках с фиксированным int середину считают как \`lo + (hi − lo) / 2\`.

**Сложность:** O(log n).`,
    hints: ['Сравните средний элемент с target и отбросьте половину.'],
  },
  {
    id: 'first-last',
    title: 'Первое и последнее вхождение',
    difficulty: 'medium',
    pattern: 'Бинарный поиск',
    topic: 'algo-binsearch',
    statement: `В отсортированном по неубыванию массиве найдите первую и последнюю позицию \`target\`. Если его нет — верните \`[-1, -1]\`. Нужно O(log n).`,
    fn: 'searchRange',
    params: ['nums', 'target'],
    tests: [
      { args: [[5, 7, 7, 8, 8, 10], 8], expected: [3, 4] },
      { args: [[5, 7, 7, 8, 8, 10], 6], expected: [-1, -1] },
      { args: [[], 0], expected: [-1, -1] },
      { args: [[2, 2, 2], 2], expected: [0, 2] },
      { args: [[1], 1], expected: [0, 0] },
      { args: [[1, 2, 3], 4], expected: [-1, -1] },
    ],
    solution: {
      py: `def searchRange(nums, target):
    def lower(x):
        lo, hi = 0, len(nums)
        while lo < hi:
            mid = (lo + hi) // 2
            if nums[mid] < x:
                lo = mid + 1
            else:
                hi = mid
        return lo
    l = lower(target)
    if l == len(nums) or nums[l] != target:
        return [-1, -1]
    return [l, lower(target + 1) - 1]`,
      js: `function searchRange(nums, target) {
    const lower = (x) => {
        let lo = 0, hi = nums.length
        while (lo < hi) {
            const mid = (lo + hi) >> 1
            if (nums[mid] < x) lo = mid + 1
            else hi = mid
        }
        return lo
    }
    const l = lower(target)
    if (l === nums.length || nums[l] !== target) return [-1, -1]
    return [l, lower(target + 1) - 1]
}`,
    },
    explanation: `Функция \`lower(x)\` возвращает первую позицию, где элемент ≥ x (lower_bound). Первое вхождение — \`lower(target)\`, последнее — \`lower(target + 1) − 1\` для целых чисел. Один шаблон бинпоиска — меньше шансов ошибиться в границах.

**Сложность:** O(log n).`,
    hints: ['Найдите первую позицию элемента ≥ target.', 'Как через ту же функцию найти последнее вхождение?'],
  },
  {
    id: 'search-rotated',
    title: 'Поиск в повёрнутом массиве',
    difficulty: 'medium',
    pattern: 'Бинарный поиск',
    topic: 'algo-binsearch',
    statement: `Отсортированный массив различных чисел циклически сдвинули: \`[0,1,2,4,5,6,7]\` мог стать \`[4,5,6,7,0,1,2]\`. Найдите индекс \`target\` или -1 за O(log n).`,
    fn: 'searchRotated',
    params: ['nums', 'target'],
    tests: [
      { args: [[4, 5, 6, 7, 0, 1, 2], 0], expected: 4 },
      { args: [[4, 5, 6, 7, 0, 1, 2], 3], expected: -1 },
      { args: [[1], 0], expected: -1 },
      { args: [[3, 1], 1], expected: 1 },
      { args: [[5, 1, 3], 5], expected: 0 },
      { args: [[1, 2, 3, 4], 4], expected: 3 },
    ],
    solution: {
      py: `def searchRotated(nums, target):
    lo, hi = 0, len(nums) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if nums[mid] == target:
            return mid
        if nums[lo] <= nums[mid]:
            if nums[lo] <= target < nums[mid]:
                hi = mid - 1
            else:
                lo = mid + 1
        else:
            if nums[mid] < target <= nums[hi]:
                lo = mid + 1
            else:
                hi = mid - 1
    return -1`,
      js: `function searchRotated(nums, target) {
    let lo = 0, hi = nums.length - 1
    while (lo <= hi) {
        const mid = (lo + hi) >> 1
        if (nums[mid] === target) return mid
        if (nums[lo] <= nums[mid]) {
            if (nums[lo] <= target && target < nums[mid]) hi = mid - 1
            else lo = mid + 1
        } else {
            if (nums[mid] < target && target <= nums[hi]) lo = mid + 1
            else hi = mid - 1
        }
    }
    return -1
}`,
    },
    explanation: `В любой момент хотя бы одна половина — \`[lo, mid]\` или \`[mid, hi]\` — отсортирована. Определяем её сравнением концов. Если target попадает в диапазон отсортированной половины — ищем там, иначе в другой.

**Сложность:** O(log n).`,
    hints: ['Одна из половин всегда отсортирована. Как понять, какая?'],
  },
  {
    id: 'int-sqrt',
    title: 'Целый квадратный корень',
    difficulty: 'easy',
    pattern: 'Бинарный поиск',
    topic: 'algo-binsearch',
    statement: `Верните целую часть квадратного корня из неотрицательного целого \`x\` без использования встроенных функций корня и степени.`,
    fn: 'mySqrt',
    params: ['x'],
    tests: [
      { args: [4], expected: 2 },
      { args: [8], expected: 2 },
      { args: [0], expected: 0 },
      { args: [1], expected: 1 },
      { args: [2147395599], expected: 46339 },
    ],
    solution: {
      py: `def mySqrt(x):
    lo, hi = 0, x
    while lo < hi:
        mid = (lo + hi + 1) // 2
        if mid * mid <= x:
            lo = mid
        else:
            hi = mid - 1
    return lo`,
      js: `function mySqrt(x) {
    let lo = 0, hi = x
    while (lo < hi) {
        const mid = Math.floor((lo + hi + 1) / 2)
        if (mid * mid <= x) lo = mid
        else hi = mid - 1
    }
    return lo
}`,
    },
    explanation: `Ищем наибольшее \`m\`, для которого \`m² ≤ x\` — это бинпоиск по ответу с условием, монотонным по \`m\`. Когда ищем «последнее подходящее», середину берём с округлением вверх, иначе при \`lo = mid\` цикл зациклится.

В C++/Java \`mid * mid\` переполняет int — нужен long.

**Сложность:** O(log x).`,
    hints: ['Условие m·m ≤ x монотонно по m.'],
  },
  {
    id: 'koko-bananas',
    title: 'Минимальная скорость поедания',
    difficulty: 'medium',
    pattern: 'Бинарный поиск',
    topic: 'algo-binsearch',
    statement: `Есть кучки бананов \`piles\` и \`h\` часов. За час можно съесть до \`k\` бананов из **одной** кучки (если в кучке меньше — доедаем её и ждём конца часа). Найдите минимальную целую скорость \`k\`, чтобы успеть съесть всё за \`h\` часов. Гарантируется \`h ≥ len(piles)\`.`,
    fn: 'minEatingSpeed',
    params: ['piles', 'h'],
    tests: [
      { args: [[3, 6, 7, 11], 8], expected: 4 },
      { args: [[30, 11, 23, 4, 20], 5], expected: 30 },
      { args: [[30, 11, 23, 4, 20], 6], expected: 23 },
      { args: [[1], 1], expected: 1 },
      { args: [[1000000000], 2], expected: 500000000 },
    ],
    solution: {
      py: `def minEatingSpeed(piles, h):
    lo, hi = 1, max(piles)
    while lo < hi:
        k = (lo + hi) // 2
        hours = sum((p + k - 1) // k for p in piles)
        if hours <= h:
            hi = k
        else:
            lo = k + 1
    return lo`,
      js: `function minEatingSpeed(piles, h) {
    let lo = 1, hi = Math.max(...piles)
    while (lo < hi) {
        const k = Math.floor((lo + hi) / 2)
        let hours = 0
        for (const p of piles) hours += Math.ceil(p / k)
        if (hours <= h) hi = k
        else lo = k + 1
    }
    return lo
}`,
    },
    explanation: `Бинпоиск по ответу. Для скорости \`k\` время считается за O(n): сумма \`ceil(p / k)\`. Чем больше скорость, тем меньше часов — условие «успеваем» монотонно. Ищем минимальную подходящую скорость между 1 и максимальной кучкой.

**Сложность:** O(n log max(piles)).`,
    hints: ['Если скорость k подходит, подойдёт ли k + 1?', 'Как быстро проверить конкретную скорость?'],
  },
  {
    id: 'ship-capacity',
    title: 'Грузоподъёмность для доставки за D дней',
    difficulty: 'medium',
    pattern: 'Бинарный поиск',
    topic: 'algo-binsearch',
    statement: `Посылки с весами \`weights\` нужно отвезти **в заданном порядке** за \`days\` дней. Каждый день грузим посылки подряд, пока суммарный вес не превышает грузоподъёмность. Найдите минимальную грузоподъёмность.`,
    fn: 'shipWithinDays',
    params: ['weights', 'days'],
    tests: [
      { args: [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 5], expected: 15 },
      { args: [[3, 2, 2, 4, 1, 4], 3], expected: 6 },
      { args: [[1, 2, 3, 1, 1], 4], expected: 3 },
      { args: [[10], 1], expected: 10 },
      { args: [[5, 5, 5, 5], 4], expected: 5 },
    ],
    solution: {
      py: `def shipWithinDays(weights, days):
    def need(cap):
        d, cur = 1, 0
        for w in weights:
            if cur + w > cap:
                d += 1
                cur = 0
            cur += w
        return d
    lo, hi = max(weights), sum(weights)
    while lo < hi:
        mid = (lo + hi) // 2
        if need(mid) <= days:
            hi = mid
        else:
            lo = mid + 1
    return lo`,
      js: `function shipWithinDays(weights, days) {
    const need = (cap) => {
        let d = 1, cur = 0
        for (const w of weights) {
            if (cur + w > cap) { d++; cur = 0 }
            cur += w
        }
        return d
    }
    let lo = Math.max(...weights), hi = weights.reduce((a, b) => a + b, 0)
    while (lo < hi) {
        const mid = Math.floor((lo + hi) / 2)
        if (need(mid) <= days) hi = mid
        else lo = mid + 1
    }
    return lo
}`,
    },
    explanation: `Нижняя граница ответа — самая тяжёлая посылка (иначе её не увезти), верхняя — сумма всех весов (всё за один день). Для фиксированной вместимости число дней считаем жадно. Бинпоиск по минимальной вместимости, укладывающейся в \`days\`.

**Сложность:** O(n log(sum)).`,
    hints: ['Какие минимальная и максимальная вместимости имеют смысл?', 'Жадно посчитайте дни для заданной вместимости.'],
  },
  {
    id: 'longest-unique-substring',
    title: 'Самая длинная подстрока без повторов',
    difficulty: 'medium',
    pattern: 'Префиксные суммы и окно',
    topic: 'algo-prefix-window',
    statement: `Найдите длину самой длинной подстроки без повторяющихся символов.`,
    fn: 'lengthOfLongestSubstring',
    params: ['s'],
    tests: [
      { args: ['abcabcbb'], expected: 3 },
      { args: ['bbbbb'], expected: 1 },
      { args: ['pwwkew'], expected: 3 },
      { args: [''], expected: 0 },
      { args: ['abba'], expected: 2 },
      { args: ['dvdf'], expected: 3 },
    ],
    solution: {
      py: `def lengthOfLongestSubstring(s):
    last = {}
    l = best = 0
    for r, ch in enumerate(s):
        if ch in last and last[ch] >= l:
            l = last[ch] + 1
        last[ch] = r
        best = max(best, r - l + 1)
    return best`,
      js: `function lengthOfLongestSubstring(s) {
    const last = new Map()
    let l = 0, best = 0
    for (let r = 0; r < s.length; r++) {
        if (last.has(s[r]) && last.get(s[r]) >= l) l = last.get(s[r]) + 1
        last.set(s[r], r)
        best = Math.max(best, r - l + 1)
    }
    return best
}`,
    },
    explanation: `Окно \`[l, r]\` без повторов. Когда символ \`s[r]\` уже встречался внутри окна, сдвигаем \`l\` за его прошлую позицию. Проверка \`last[ch] >= l\` важна: старое вхождение слева от окна не должно двигать \`l\` назад (тест «abba»).

**Сложность:** O(n).`,
    hints: ['Поддерживайте окно без повторов.', 'Запоминайте последнюю позицию каждого символа.'],
  },
  {
    id: 'max-avg-window',
    title: 'Максимальная сумма окна длины k',
    difficulty: 'easy',
    pattern: 'Префиксные суммы и окно',
    topic: 'algo-prefix-window',
    statement: `Найдите максимальную сумму подмассива длины ровно \`k\` (\`1 ≤ k ≤ n\`). Решите за O(n).`,
    fn: 'maxWindowSum',
    params: ['nums', 'k'],
    tests: [
      { args: [[1, 12, -5, -6, 50, 3], 4], expected: 51 },
      { args: [[5], 1], expected: 5 },
      { args: [[-1, -2, -3], 2], expected: -3 },
      { args: [[2, 1, 5, 1, 3, 2], 3], expected: 9 },
    ],
    solution: {
      py: `def maxWindowSum(nums, k):
    s = sum(nums[:k])
    best = s
    for i in range(k, len(nums)):
        s += nums[i] - nums[i - k]
        best = max(best, s)
    return best`,
      js: `function maxWindowSum(nums, k) {
    let s = 0
    for (let i = 0; i < k; i++) s += nums[i]
    let best = s
    for (let i = k; i < nums.length; i++) {
        s += nums[i] - nums[i - k]
        best = Math.max(best, s)
    }
    return best
}`,
    },
    explanation: `Окно фиксированной длины: при сдвиге добавляем новый элемент и вычитаем ушедший. Начальный максимум — сумма первого окна, а не 0, иначе ошибёмся на отрицательных числах.

**Сложность:** O(n).`,
    hints: ['Как пересчитать сумму окна при сдвиге на один элемент?'],
  },
  {
    id: 'min-window',
    title: 'Минимальное окно, содержащее все символы',
    difficulty: 'hard',
    pattern: 'Префиксные суммы и окно',
    topic: 'algo-prefix-window',
    statement: `Даны строки \`s\` и \`t\`. Найдите в \`s\` самую короткую подстроку, содержащую все символы \`t\` с учётом кратности. Если таких несколько — верните самую левую. Если нет — пустую строку.`,
    fn: 'minWindow',
    params: ['s', 't'],
    tests: [
      { args: ['ADOBECODEBANC', 'ABC'], expected: 'BANC' },
      { args: ['a', 'a'], expected: 'a' },
      { args: ['a', 'aa'], expected: '' },
      { args: ['aaflslflsldkalskaaa', 'aaa'], expected: 'aaa' },
      { args: ['ab', 'b'], expected: 'b' },
    ],
    solution: {
      py: `from collections import Counter

def minWindow(s, t):
    need = Counter(t)
    missing = len(t)
    l = 0
    best = (float("inf"), 0, 0)
    for r, ch in enumerate(s):
        if need[ch] > 0:
            missing -= 1
        need[ch] -= 1
        while missing == 0:
            if r - l + 1 < best[0]:
                best = (r - l + 1, l, r + 1)
            need[s[l]] += 1
            if need[s[l]] > 0:
                missing += 1
            l += 1
    return s[best[1]:best[2]] if best[0] != float("inf") else ""`,
      js: `function minWindow(s, t) {
    const need = new Map()
    for (const ch of t) need.set(ch, (need.get(ch) || 0) + 1)
    let missing = t.length, l = 0, bestLen = Infinity, bestL = 0
    for (let r = 0; r < s.length; r++) {
        const c = s[r]
        if ((need.get(c) || 0) > 0) missing--
        need.set(c, (need.get(c) || 0) - 1)
        while (missing === 0) {
            if (r - l + 1 < bestLen) { bestLen = r - l + 1; bestL = l }
            need.set(s[l], need.get(s[l]) + 1)
            if (need.get(s[l]) > 0) missing++
            l++
        }
    }
    return bestLen === Infinity ? '' : s.slice(bestL, bestL + bestLen)
}`,
    },
    explanation: `Окно с двумя фазами: правая граница расширяется, пока окно не покроет все символы \`t\` (счётчик \`missing\` дошёл до нуля). Затем левая граница сужает окно, пока оно остаётся валидным, и на каждом шаге обновляем ответ. \`need[ch]\` может уходить в минус — это «лишние» копии символа в окне.

**Сложность:** O(|s| + |t|).`,
    hints: ['Сначала расширяйте окно до валидного, затем сужайте.', 'Храните, сколько символов t ещё не покрыто.'],
  },
  {
    id: 'range-sum',
    title: 'Суммы на отрезках',
    difficulty: 'easy',
    pattern: 'Префиксные суммы и окно',
    topic: 'algo-prefix-window',
    statement: `Дан массив \`nums\` и список запросов \`[l, r]\` (включительно, 0-индексация). Верните массив сумм \`nums[l..r]\` для каждого запроса. Запросов может быть 10⁵ — каждый должен обрабатываться за O(1).`,
    fn: 'rangeSums',
    params: ['nums', 'queries'],
    tests: [
      { args: [[-2, 0, 3, -5, 2, -1], [[0, 2], [2, 5], [0, 5]]], expected: [1, -1, -3] },
      { args: [[5], [[0, 0]]], expected: [5] },
      { args: [[1, 2, 3, 4], []], expected: [] },
      { args: [[1, 2, 3, 4], [[1, 1], [0, 3], [3, 3]]], expected: [2, 10, 4] },
    ],
    solution: {
      py: `def rangeSums(nums, queries):
    pref = [0]
    for x in nums:
        pref.append(pref[-1] + x)
    return [pref[r + 1] - pref[l] for l, r in queries]`,
      js: `function rangeSums(nums, queries) {
    const pref = [0]
    for (const x of nums) pref.push(pref[pref.length - 1] + x)
    return queries.map(([l, r]) => pref[r + 1] - pref[l])
}`,
    },
    explanation: `Префиксные суммы с ведущим нулём: \`pref[i]\` — сумма первых \`i\` элементов. Тогда сумма \`[l, r]\` = \`pref[r + 1] − pref[l]\`. Ведущий ноль убирает особый случай \`l = 0\`.

**Сложность:** O(n + q).`,
    hints: ['Посчитайте суммы всех префиксов заранее.'],
  },
  {
    id: 'max-ones-k-flips',
    title: 'Самый длинный отрезок единиц с k заменами',
    difficulty: 'medium',
    pattern: 'Префиксные суммы и окно',
    topic: 'algo-prefix-window',
    statement: `Дан массив из 0 и 1 и число \`k\`. Можно заменить не более \`k\` нулей на единицы. Найдите длину самого длинного подмассива из одних единиц после замен.`,
    fn: 'longestOnes',
    params: ['nums', 'k'],
    tests: [
      { args: [[1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0], 2], expected: 6 },
      { args: [[0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1], 3], expected: 10 },
      { args: [[0, 0, 0], 0], expected: 0 },
      { args: [[1, 0, 1], 5], expected: 3 },
    ],
    solution: {
      py: `def longestOnes(nums, k):
    l = zeros = best = 0
    for r, x in enumerate(nums):
        if x == 0:
            zeros += 1
        while zeros > k:
            if nums[l] == 0:
                zeros -= 1
            l += 1
        best = max(best, r - l + 1)
    return best`,
      js: `function longestOnes(nums, k) {
    let l = 0, zeros = 0, best = 0
    for (let r = 0; r < nums.length; r++) {
        if (nums[r] === 0) zeros++
        while (zeros > k) { if (nums[l] === 0) zeros--; l++ }
        best = Math.max(best, r - l + 1)
    }
    return best
}`,
    },
    explanation: `Переформулировка: найти самое длинное окно, в котором не больше \`k\` нулей. Условие монотонно — сужение окна не увеличивает число нулей, поэтому работает скользящее окно.

**Сложность:** O(n).`,
    hints: ['Переформулируйте: сколько нулей может быть в окне?'],
  },
]
