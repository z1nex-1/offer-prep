import type { SqlDataset, SqlTask } from '../types'

export const datasets: SqlDataset[] = [
  {
    id: 'shop',
    title: 'Интернет-магазин',
    description: 'Пользователи, товары, заказы и позиции заказов. Цена в order_items — цена на момент покупки. Статусы заказа: completed, cancelled, new.',
    sql: `
CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT, city TEXT, registered_at TEXT);
CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT, category TEXT, price INTEGER);
CREATE TABLE orders (id INTEGER PRIMARY KEY, user_id INTEGER, created_at TEXT, status TEXT);
CREATE TABLE order_items (order_id INTEGER, product_id INTEGER, qty INTEGER, price INTEGER);
INSERT INTO users VALUES
 (1,'Анна','Москва','2026-01-05'),(2,'Борис','Санкт-Петербург','2026-01-12'),(3,'Вика','Москва','2026-02-01'),
 (4,'Глеб','Казань','2026-02-10'),(5,'Даша','Новосибирск','2026-02-15'),(6,'Егор','Москва','2026-03-01'),
 (7,'Жанна','Санкт-Петербург','2026-03-08'),(8,'Захар','Казань','2026-03-20'),(9,'Ира','Москва','2026-04-02'),(10,'Кирилл','Екатеринбург','2026-04-11');
INSERT INTO products VALUES
 (1,'Ноутбук','Электроника',80000),(2,'Мышь','Электроника',1500),(3,'Наушники','Электроника',6000),
 (4,'Кофеварка','Дом',12000),(5,'Плед','Дом',2500),(6,'Кружка','Дом',600),
 (7,'Книга по SQL','Книги',1200),(8,'Роман','Книги',700),(9,'Кроссовки','Спорт',9000),(10,'Коврик для йоги','Спорт',1800);
INSERT INTO orders VALUES
 (1,1,'2026-01-10','completed'),(2,1,'2026-02-14','completed'),(3,2,'2026-01-20','completed'),(4,3,'2026-02-03','cancelled'),
 (5,3,'2026-03-05','completed'),(6,4,'2026-02-20','completed'),(7,5,'2026-03-01','completed'),(8,6,'2026-03-10','new'),
 (9,6,'2026-03-15','completed'),(10,7,'2026-03-25','completed'),(11,2,'2026-04-01','completed'),(12,1,'2026-04-05','cancelled'),
 (13,9,'2026-04-10','completed'),(14,4,'2026-04-18','completed'),(15,5,'2026-04-20','completed');
INSERT INTO order_items VALUES
 (1,1,1,80000),(1,2,1,1500),(2,7,2,1200),(3,3,1,6000),(3,6,4,600),(4,9,1,9000),(5,4,1,12000),(5,5,2,2500),
 (6,8,3,700),(6,7,1,1200),(7,9,1,9000),(7,10,1,1800),(8,2,2,1500),(9,1,1,78000),(10,5,1,2500),(10,6,2,600),
 (11,3,2,5800),(12,4,1,12000),(13,10,2,1800),(13,8,1,700),(14,2,1,1500),(15,4,1,11500),(15,6,6,600);
`,
  },
  {
    id: 'staff',
    title: 'Сотрудники и отделы',
    description: 'Классика собеседований: сотрудники, отделы, руководители (manager_id ссылается на employees.id), зарплаты.',
    sql: `
CREATE TABLE departments (id INTEGER PRIMARY KEY, name TEXT);
CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT, department_id INTEGER, manager_id INTEGER, salary INTEGER, hired_at TEXT);
INSERT INTO departments VALUES (1,'Разработка'),(2,'Аналитика'),(3,'Маркетинг'),(4,'Юристы');
INSERT INTO employees VALUES
 (1,'Ольга',1,NULL,400000,'2019-03-01'),(2,'Павел',1,1,250000,'2020-06-15'),(3,'Роман',1,1,310000,'2021-01-10'),
 (4,'Света',1,2,180000,'2023-09-01'),(5,'Тимур',1,2,260000,'2022-02-20'),(6,'Ульяна',2,1,230000,'2020-11-11'),
 (7,'Фёдор',2,6,150000,'2024-02-01'),(8,'Хлоя',2,6,240000,'2021-07-07'),(9,'Цезарь',3,1,200000,'2020-04-04'),
 (10,'Чулпан',3,9,120000,'2024-06-01'),(11,'Шамиль',3,9,120000,'2023-03-15'),(12,'Эмма',1,3,330000,'2022-08-08');
`,
  },
  {
    id: 'events',
    title: 'Продуктовые события',
    description: 'Мобильное приложение: регистрации с источником трафика, события по дням (open, view, cart, purchase) и платежи. Даты — в формате YYYY-MM-DD.',
    sql: `
CREATE TABLE users (user_id INTEGER PRIMARY KEY, signup_date TEXT, source TEXT);
CREATE TABLE events (user_id INTEGER, event_date TEXT, event_name TEXT);
CREATE TABLE payments (user_id INTEGER, pay_date TEXT, amount INTEGER);
INSERT INTO users VALUES
 (1,'2026-05-01','ads'),(2,'2026-05-01','organic'),(3,'2026-05-01','ads'),(4,'2026-05-02','referral'),
 (5,'2026-05-02','ads'),(6,'2026-05-02','organic'),(7,'2026-05-03','organic'),(8,'2026-05-03','ads'),(9,'2026-05-03','referral'),(10,'2026-05-04','organic');
INSERT INTO events VALUES
 (1,'2026-05-01','open'),(1,'2026-05-01','view'),(1,'2026-05-02','open'),(1,'2026-05-02','view'),(1,'2026-05-02','cart'),(1,'2026-05-03','open'),(1,'2026-05-03','purchase'),
 (2,'2026-05-01','open'),(2,'2026-05-01','view'),(2,'2026-05-01','cart'),(2,'2026-05-01','purchase'),(2,'2026-05-04','open'),
 (3,'2026-05-01','open'),
 (4,'2026-05-02','open'),(4,'2026-05-02','view'),(4,'2026-05-03','open'),(4,'2026-05-03','view'),(4,'2026-05-04','open'),(4,'2026-05-04','cart'),(4,'2026-05-04','purchase'),
 (5,'2026-05-02','open'),(5,'2026-05-02','view'),(5,'2026-05-03','open'),
 (6,'2026-05-02','open'),(6,'2026-05-04','open'),(6,'2026-05-04','view'),
 (7,'2026-05-03','open'),(7,'2026-05-03','view'),(7,'2026-05-03','cart'),(7,'2026-05-04','open'),(7,'2026-05-04','purchase'),
 (8,'2026-05-03','open'),(8,'2026-05-03','view'),
 (9,'2026-05-03','open'),(9,'2026-05-04','open'),(9,'2026-05-05','open'),(9,'2026-05-05','view'),
 (10,'2026-05-04','open'),(10,'2026-05-04','view'),(10,'2026-05-04','cart');
INSERT INTO payments VALUES
 (1,'2026-05-03',990),(2,'2026-05-01',490),(2,'2026-05-04',490),(4,'2026-05-04',1990),(7,'2026-05-04',990);
`,
  },
  {
    id: 'ab',
    title: 'A/B-тест',
    description: 'Пользователи распределены в группы control и test. Таблица orders содержит покупки во время теста. У части пользователей покупок нет.',
    sql: `
CREATE TABLE assignments (user_id INTEGER, grp TEXT, assigned_at TEXT);
CREATE TABLE orders (user_id INTEGER, created_at TEXT, revenue INTEGER);
INSERT INTO assignments VALUES
 (1,'control','2026-06-01'),(2,'control','2026-06-01'),(3,'control','2026-06-01'),(4,'control','2026-06-02'),(5,'control','2026-06-02'),
 (6,'control','2026-06-02'),(7,'control','2026-06-03'),(8,'control','2026-06-03'),(9,'test','2026-06-01'),(10,'test','2026-06-01'),
 (11,'test','2026-06-01'),(12,'test','2026-06-02'),(13,'test','2026-06-02'),(14,'test','2026-06-02'),(15,'test','2026-06-03'),
 (16,'test','2026-06-03'),(17,'control','2026-06-03'),(17,'test','2026-06-04');
INSERT INTO orders VALUES
 (1,'2026-06-02',1000),(3,'2026-06-03',500),(3,'2026-06-05',700),(6,'2026-06-04',1500),
 (9,'2026-06-02',1200),(10,'2026-06-02',800),(12,'2026-06-03',2000),(12,'2026-06-06',400),(13,'2026-06-04',900),(16,'2026-06-05',1100),(17,'2026-06-05',300);
`,
  },
  {
    id: 'bank',
    title: 'Банк: клиенты и транзакции',
    description: 'Клиенты, их счета и операции. amount > 0 — пополнение, amount < 0 — списание. ts — дата и время операции.',
    sql: `
CREATE TABLE clients (id INTEGER PRIMARY KEY, name TEXT, city TEXT);
CREATE TABLE accounts (id INTEGER PRIMARY KEY, client_id INTEGER, currency TEXT, opened_at TEXT);
CREATE TABLE transactions (id INTEGER PRIMARY KEY, account_id INTEGER, ts TEXT, amount INTEGER, category TEXT);
INSERT INTO clients VALUES (1,'Алексей','Москва'),(2,'Мария','Москва'),(3,'Никита','Самара'),(4,'Оксана','Тверь');
INSERT INTO accounts VALUES (10,1,'RUB','2025-01-10'),(11,1,'USD','2025-06-01'),(20,2,'RUB','2025-03-15'),(30,3,'RUB','2025-08-20'),(40,4,'RUB','2026-01-05');
INSERT INTO transactions VALUES
 (1,10,'2026-07-01 09:00',100000,'salary'),(2,10,'2026-07-02 13:10',-2500,'food'),(3,10,'2026-07-03 19:45',-12000,'shopping'),
 (4,10,'2026-07-15 10:00',-3000,'food'),(5,10,'2026-08-01 09:00',100000,'salary'),(6,10,'2026-08-03 12:00',-45000,'travel'),
 (7,11,'2026-07-05 11:00',500,'transfer'),(8,11,'2026-07-20 11:00',-120,'shopping'),
 (9,20,'2026-07-01 08:00',80000,'salary'),(10,20,'2026-07-01 20:00',-1500,'food'),(11,20,'2026-07-10 18:30',-30000,'shopping'),
 (12,20,'2026-08-02 09:30',-2200,'food'),(13,30,'2026-07-12 15:00',50000,'transfer'),(14,30,'2026-07-12 15:05',-9000,'shopping'),
 (15,30,'2026-07-12 15:07',-9500,'shopping'),(16,30,'2026-07-12 15:09',-9800,'shopping'),(17,30,'2026-08-05 10:00',-700,'food'),
 (18,40,'2026-08-01 12:00',20000,'salary');
`,
  },
]

export const sqlTasks: SqlTask[] = [
  {
    id: 'shop-moscow',
    title: 'Пользователи из Москвы',
    difficulty: 'easy',
    dataset: 'shop',
    skills: ['WHERE', 'ORDER BY'],
    statement: 'Выведите `id` и `name` пользователей из Москвы, отсортированных по дате регистрации от новых к старым.',
    solution: `SELECT id, name
FROM users
WHERE city = 'Москва'
ORDER BY registered_at DESC;`,
    ordered: true,
  },
  {
    id: 'shop-status-count',
    title: 'Заказы по статусам',
    difficulty: 'easy',
    dataset: 'shop',
    skills: ['GROUP BY', 'COUNT'],
    statement: 'Посчитайте количество заказов в каждом статусе. Столбцы: `status`, `orders_cnt`. Отсортируйте по убыванию количества.',
    solution: `SELECT status, COUNT(*) AS orders_cnt
FROM orders
GROUP BY status
ORDER BY orders_cnt DESC;`,
    ordered: true,
  },
  {
    id: 'shop-order-total',
    title: 'Сумма каждого заказа',
    difficulty: 'easy',
    dataset: 'shop',
    skills: ['JOIN', 'SUM', 'GROUP BY'],
    statement: 'Для каждого заказа посчитайте его сумму (цена из `order_items` × количество). Столбцы: `order_id`, `total`. Порядок — по `order_id`.',
    solution: `SELECT order_id, SUM(qty * price) AS total
FROM order_items
GROUP BY order_id
ORDER BY order_id;`,
    ordered: true,
  },
  {
    id: 'shop-no-orders',
    title: 'Пользователи без заказов',
    difficulty: 'easy',
    dataset: 'shop',
    skills: ['LEFT JOIN', 'IS NULL'],
    statement: 'Найдите пользователей, у которых нет ни одного заказа (в любом статусе). Выведите `id`, `name`.',
    hint: 'LEFT JOIN сохраняет пользователей без пары, у них поля заказа будут NULL. Альтернатива — NOT EXISTS.',
    solution: `SELECT u.id, u.name
FROM users u
LEFT JOIN orders o ON o.user_id = u.id
WHERE o.id IS NULL;`,
  },
  {
    id: 'shop-top-products',
    title: 'Топ-3 товара по выручке',
    difficulty: 'medium',
    dataset: 'shop',
    skills: ['JOIN', 'GROUP BY', 'LIMIT'],
    statement: 'Найдите три товара с наибольшей выручкой **по завершённым** заказам (`status = completed`). Столбцы: `name`, `revenue`. По убыванию выручки.',
    solution: `SELECT p.name, SUM(oi.qty * oi.price) AS revenue
FROM order_items oi
JOIN orders o ON o.id = oi.order_id
JOIN products p ON p.id = oi.product_id
WHERE o.status = 'completed'
GROUP BY p.id, p.name
ORDER BY revenue DESC
LIMIT 3;`,
    ordered: true,
  },
  {
    id: 'shop-avg-check-city',
    title: 'Средний чек по городам',
    difficulty: 'medium',
    dataset: 'shop',
    skills: ['Подзапрос', 'JOIN', 'AVG'],
    statement: 'Посчитайте средний чек завершённых заказов по городам пользователей. Средний чек — средняя сумма заказа. Столбцы: `city`, `avg_check` (округлите до целого через `ROUND(..., 0)`). Отсортируйте по убыванию среднего чека.',
    hint: 'Сначала посчитайте сумму каждого заказа в подзапросе или CTE, потом усредняйте. AVG по строкам order_items даст средний товар, а не средний чек.',
    solution: `WITH totals AS (
  SELECT o.id, o.user_id, SUM(oi.qty * oi.price) AS total
  FROM orders o
  JOIN order_items oi ON oi.order_id = o.id
  WHERE o.status = 'completed'
  GROUP BY o.id, o.user_id
)
SELECT u.city, ROUND(AVG(t.total), 0) AS avg_check
FROM totals t
JOIN users u ON u.id = t.user_id
GROUP BY u.city
ORDER BY avg_check DESC;`,
    ordered: true,
  },
  {
    id: 'shop-category-having',
    title: 'Категории с выручкой больше 20 000',
    difficulty: 'medium',
    dataset: 'shop',
    skills: ['HAVING'],
    statement: 'Выведите категории, выручка которых по завершённым заказам больше 20 000. Столбцы: `category`, `revenue`.',
    hint: 'Условие на агрегат пишется в HAVING, а не в WHERE.',
    solution: `SELECT p.category, SUM(oi.qty * oi.price) AS revenue
FROM order_items oi
JOIN orders o ON o.id = oi.order_id
JOIN products p ON p.id = oi.product_id
WHERE o.status = 'completed'
GROUP BY p.category
HAVING SUM(oi.qty * oi.price) > 20000;`,
  },
  {
    id: 'shop-first-order',
    title: 'Первый заказ каждого пользователя',
    difficulty: 'medium',
    dataset: 'shop',
    skills: ['Оконные функции', 'ROW_NUMBER'],
    statement: 'Для каждого пользователя, у которого есть заказы, выведите его самый ранний заказ (в любом статусе). Столбцы: `user_id`, `order_id`, `created_at`. Порядок — по `user_id`.',
    hint: 'ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at) и фильтр по номеру 1 во внешнем запросе.',
    solution: `SELECT user_id, id AS order_id, created_at
FROM (
  SELECT o.*, ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at) AS rn
  FROM orders o
)
WHERE rn = 1
ORDER BY user_id;`,
    ordered: true,
  },
  {
    id: 'shop-monthly-cumulative',
    title: 'Выручка по месяцам с накопительным итогом',
    difficulty: 'medium',
    dataset: 'shop',
    skills: ['Оконные функции', 'strftime'],
    statement: 'Посчитайте выручку завершённых заказов по месяцам и накопительный итог. Столбцы: `month` (формат `YYYY-MM`), `revenue`, `cumulative`. По возрастанию месяца.',
    hint: "strftime('%Y-%m', created_at) даёт месяц. Накопительный итог — SUM(revenue) OVER (ORDER BY month).",
    solution: `WITH m AS (
  SELECT strftime('%Y-%m', o.created_at) AS month, SUM(oi.qty * oi.price) AS revenue
  FROM orders o
  JOIN order_items oi ON oi.order_id = o.id
  WHERE o.status = 'completed'
  GROUP BY month
)
SELECT month, revenue, SUM(revenue) OVER (ORDER BY month) AS cumulative
FROM m
ORDER BY month;`,
    ordered: true,
  },
  {
    id: 'shop-top-in-category',
    title: 'Самый дорогой товар в каждой категории',
    difficulty: 'medium',
    dataset: 'shop',
    skills: ['Оконные функции', 'RANK'],
    statement: 'По текущему прайсу (`products.price`) найдите самый дорогой товар в каждой категории. Столбцы: `category`, `name`, `price`.',
    solution: `SELECT category, name, price
FROM (
  SELECT p.*, RANK() OVER (PARTITION BY category ORDER BY price DESC) AS r
  FROM products p
)
WHERE r = 1;`,
  },
  {
    id: 'shop-category-share',
    title: 'Доля категории в выручке',
    difficulty: 'hard',
    dataset: 'shop',
    skills: ['Оконные функции', 'Доли'],
    statement: 'Для каждой категории посчитайте выручку по завершённым заказам и её долю в общей выручке в процентах, округлённую до одного знака. Столбцы: `category`, `revenue`, `share_pct`. По убыванию выручки.',
    hint: 'Общую сумму можно получить окном без PARTITION: SUM(revenue) OVER (). Не забудьте умножить на 100.0, чтобы не получить целочисленное деление.',
    solution: `WITH c AS (
  SELECT p.category, SUM(oi.qty * oi.price) AS revenue
  FROM order_items oi
  JOIN orders o ON o.id = oi.order_id
  JOIN products p ON p.id = oi.product_id
  WHERE o.status = 'completed'
  GROUP BY p.category
)
SELECT category, revenue, ROUND(100.0 * revenue / SUM(revenue) OVER (), 1) AS share_pct
FROM c
ORDER BY revenue DESC;`,
    ordered: true,
  },
  {
    id: 'shop-multi-category',
    title: 'Покупатели из нескольких категорий',
    difficulty: 'medium',
    dataset: 'shop',
    skills: ['COUNT DISTINCT', 'HAVING'],
    statement: 'Найдите пользователей, которые в завершённых заказах купили товары как минимум из двух разных категорий. Столбцы: `user_id`, `categories` (число категорий).',
    solution: `SELECT o.user_id, COUNT(DISTINCT p.category) AS categories
FROM orders o
JOIN order_items oi ON oi.order_id = o.id
JOIN products p ON p.id = oi.product_id
WHERE o.status = 'completed'
GROUP BY o.user_id
HAVING COUNT(DISTINCT p.category) >= 2;`,
  },
  {
    id: 'shop-repeat-buyers',
    title: 'Доля повторных покупателей',
    difficulty: 'medium',
    dataset: 'shop',
    skills: ['Подзапрос', 'CASE'],
    statement: 'Среди пользователей с хотя бы одним завершённым заказом посчитайте долю тех, у кого завершённых заказов два и больше. Один столбец `repeat_share`, значение от 0 до 1, округлите до двух знаков.',
    solution: `SELECT ROUND(AVG(CASE WHEN cnt >= 2 THEN 1.0 ELSE 0 END), 2) AS repeat_share
FROM (
  SELECT user_id, COUNT(*) AS cnt
  FROM orders
  WHERE status = 'completed'
  GROUP BY user_id
);`,
  },
  {
    id: 'staff-above-dept-avg',
    title: 'Зарплата выше средней по отделу',
    difficulty: 'medium',
    dataset: 'staff',
    skills: ['Коррелированный подзапрос', 'Оконные функции'],
    statement: 'Найдите сотрудников, чья зарплата выше средней по их отделу. Столбцы: `name`, `salary`.',
    hint: 'Либо подзапрос со сравнением с AVG по тому же department_id, либо AVG(salary) OVER (PARTITION BY department_id).',
    solution: `SELECT name, salary
FROM (
  SELECT e.*, AVG(salary) OVER (PARTITION BY department_id) AS dept_avg
  FROM employees e
)
WHERE salary > dept_avg;`,
  },
  {
    id: 'staff-max-per-dept',
    title: 'Самый высокооплачиваемый в отделе',
    difficulty: 'medium',
    dataset: 'staff',
    skills: ['JOIN', 'Оконные функции'],
    statement: 'Для каждого отдела выведите название отдела, имя сотрудника с максимальной зарплатой и его зарплату. Если максимальную зарплату получают несколько человек — выведите всех. Столбцы: `department`, `name`, `salary`.',
    solution: `SELECT d.name AS department, e.name, e.salary
FROM (
  SELECT e.*, MAX(salary) OVER (PARTITION BY department_id) AS mx
  FROM employees e
) e
JOIN departments d ON d.id = e.department_id
WHERE e.salary = e.mx;`,
  },
  {
    id: 'staff-earn-more-than-manager',
    title: 'Зарабатывают больше руководителя',
    difficulty: 'easy',
    dataset: 'staff',
    skills: ['SELF JOIN'],
    statement: 'Найдите сотрудников, которые получают больше своего непосредственного руководителя. Столбцы: `employee`, `manager`.',
    hint: 'Соедините таблицу employees саму с собой по manager_id.',
    solution: `SELECT e.name AS employee, m.name AS manager
FROM employees e
JOIN employees m ON m.id = e.manager_id
WHERE e.salary > m.salary;`,
  },
  {
    id: 'staff-empty-dept',
    title: 'Отделы без сотрудников',
    difficulty: 'easy',
    dataset: 'staff',
    skills: ['NOT EXISTS'],
    statement: 'Выведите названия отделов, в которых нет ни одного сотрудника. Столбец `name`.',
    solution: `SELECT d.name
FROM departments d
WHERE NOT EXISTS (SELECT 1 FROM employees e WHERE e.department_id = d.id);`,
  },
  {
    id: 'staff-second-salary',
    title: 'Вторая по величине зарплата',
    difficulty: 'medium',
    dataset: 'staff',
    skills: ['DISTINCT', 'LIMIT OFFSET'],
    statement: 'Найдите вторую по величине **уникальную** зарплату в компании. Один столбец `second_salary`.',
    hint: 'Одинаковые зарплаты не должны сбивать счёт: DISTINCT или DENSE_RANK.',
    solution: `SELECT DISTINCT salary AS second_salary
FROM employees
ORDER BY salary DESC
LIMIT 1 OFFSET 1;`,
  },
  {
    id: 'staff-top2-per-dept',
    title: 'Две самые высокие зарплаты в каждом отделе',
    difficulty: 'hard',
    dataset: 'staff',
    skills: ['DENSE_RANK', 'PARTITION BY'],
    statement: 'В каждом отделе выведите сотрудников, чья зарплата входит в две самые высокие **уникальные** зарплаты отдела. Столбцы: `department`, `name`, `salary`. Сортировка: по названию отдела, затем по убыванию зарплаты, затем по имени.',
    hint: 'DENSE_RANK не пропускает номера при одинаковых значениях — это как раз «уникальные зарплаты».',
    solution: `SELECT d.name AS department, e.name, e.salary
FROM (
  SELECT e.*, DENSE_RANK() OVER (PARTITION BY department_id ORDER BY salary DESC) AS r
  FROM employees e
) e
JOIN departments d ON d.id = e.department_id
WHERE e.r <= 2
ORDER BY department, e.salary DESC, e.name;`,
    ordered: true,
  },
  {
    id: 'staff-subordinates',
    title: 'Все подчинённые руководителя',
    difficulty: 'hard',
    dataset: 'staff',
    skills: ['Рекурсивный CTE'],
    statement: 'Найдите всех прямых и непрямых подчинённых сотрудника с `id = 1` (Ольга) и уровень вложенности (1 — прямой подчинённый). Столбцы: `name`, `level`. Сортировка по уровню, затем по имени.',
    hint: 'WITH RECURSIVE: базовая часть — прямые подчинённые, рекурсивная — подчинённые уже найденных.',
    solution: `WITH RECURSIVE sub AS (
  SELECT id, name, 1 AS level FROM employees WHERE manager_id = 1
  UNION ALL
  SELECT e.id, e.name, s.level + 1 FROM employees e JOIN sub s ON e.manager_id = s.id
)
SELECT name, level FROM sub ORDER BY level, name;`,
    ordered: true,
  },
  {
    id: 'events-dau',
    title: 'DAU по дням',
    difficulty: 'easy',
    dataset: 'events',
    skills: ['COUNT DISTINCT'],
    statement: 'Посчитайте DAU — число уникальных пользователей с любым событием — по каждому дню. Столбцы: `event_date`, `dau`. По возрастанию даты.',
    solution: `SELECT event_date, COUNT(DISTINCT user_id) AS dau
FROM events
GROUP BY event_date
ORDER BY event_date;`,
    ordered: true,
  },
  {
    id: 'events-signups-source',
    title: 'Регистрации по источникам',
    difficulty: 'easy',
    dataset: 'events',
    skills: ['GROUP BY'],
    statement: 'Сколько пользователей пришло из каждого источника? Столбцы: `source`, `users`. По убыванию, при равенстве — по названию источника.',
    solution: `SELECT source, COUNT(*) AS users
FROM users
GROUP BY source
ORDER BY users DESC, source;`,
    ordered: true,
  },
  {
    id: 'events-funnel',
    title: 'Воронка view → cart → purchase',
    difficulty: 'medium',
    dataset: 'events',
    skills: ['CASE', 'COUNT DISTINCT'],
    statement: 'Посчитайте, сколько уникальных пользователей совершили хотя бы раз каждое из событий `view`, `cart`, `purchase`. Одна строка со столбцами `viewed`, `carted`, `purchased`.',
    hint: 'COUNT(DISTINCT CASE WHEN event_name = ... THEN user_id END) считает уникальных пользователей по условию.',
    solution: `SELECT
  COUNT(DISTINCT CASE WHEN event_name = 'view' THEN user_id END) AS viewed,
  COUNT(DISTINCT CASE WHEN event_name = 'cart' THEN user_id END) AS carted,
  COUNT(DISTINCT CASE WHEN event_name = 'purchase' THEN user_id END) AS purchased
FROM events;`,
  },
  {
    id: 'events-conversion-source',
    title: 'Конверсия в оплату по источникам',
    difficulty: 'medium',
    dataset: 'events',
    skills: ['LEFT JOIN', 'Конверсия'],
    statement: 'Для каждого источника посчитайте число пользователей, число платящих (есть хотя бы один платёж) и конверсию в процентах с одним знаком. Столбцы: `source`, `users`, `payers`, `conversion_pct`. Сортировка по источнику.',
    solution: `SELECT u.source,
  COUNT(*) AS users,
  COUNT(p.user_id) AS payers,
  ROUND(100.0 * COUNT(p.user_id) / COUNT(*), 1) AS conversion_pct
FROM users u
LEFT JOIN (SELECT DISTINCT user_id FROM payments) p ON p.user_id = u.user_id
GROUP BY u.source
ORDER BY u.source;`,
    ordered: true,
  },
  {
    id: 'events-arppu',
    title: 'ARPU и ARPPU',
    difficulty: 'medium',
    dataset: 'events',
    skills: ['Метрики', 'Подзапросы'],
    statement: 'Посчитайте ARPU (выручка на всех зарегистрированных пользователей) и ARPPU (выручка на платящих пользователей). Одна строка: `arpu`, `arppu`, оба округлены до одного знака.',
    solution: `SELECT
  ROUND(1.0 * (SELECT SUM(amount) FROM payments) / (SELECT COUNT(*) FROM users), 1) AS arpu,
  ROUND(1.0 * (SELECT SUM(amount) FROM payments) / (SELECT COUNT(DISTINCT user_id) FROM payments), 1) AS arppu;`,
  },
  {
    id: 'events-retention-d1',
    title: 'Retention первого дня',
    difficulty: 'hard',
    dataset: 'events',
    skills: ['Retention', 'date()', 'Когорты'],
    statement: 'Для каждой когорты (дата регистрации) посчитайте размер когорты и долю пользователей, у которых есть событие на следующий день после регистрации (retention D1), в процентах с одним знаком. Столбцы: `signup_date`, `cohort`, `d1_pct`. По дате.',
    hint: "date(signup_date, '+1 day') даёт следующий день. Посчитайте вернувшихся через EXISTS или LEFT JOIN с DISTINCT.",
    solution: `SELECT u.signup_date,
  COUNT(*) AS cohort,
  ROUND(100.0 * SUM(CASE WHEN EXISTS (
    SELECT 1 FROM events e WHERE e.user_id = u.user_id AND e.event_date = date(u.signup_date, '+1 day')
  ) THEN 1 ELSE 0 END) / COUNT(*), 1) AS d1_pct
FROM users u
GROUP BY u.signup_date
ORDER BY u.signup_date;`,
    ordered: true,
  },
  {
    id: 'events-streak',
    title: 'Активность три дня подряд',
    difficulty: 'hard',
    dataset: 'events',
    skills: ['Gaps and islands', 'ROW_NUMBER', 'julianday'],
    statement: 'Найдите пользователей, которые заходили в приложение (любое событие) как минимум три календарных дня подряд. Столбец `user_id`, по возрастанию.',
    hint: 'Классический приём «острова»: для уникальных дней пользователя julianday(day) − ROW_NUMBER() одинаков внутри серии подряд идущих дней.',
    solution: `WITH days AS (
  SELECT DISTINCT user_id, event_date FROM events
), g AS (
  SELECT user_id, event_date,
    julianday(event_date) - ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY event_date) AS grp
  FROM days
)
SELECT DISTINCT user_id
FROM g
GROUP BY user_id, grp
HAVING COUNT(*) >= 3
ORDER BY user_id;`,
    ordered: true,
  },
  {
    id: 'events-time-to-pay',
    title: 'Сколько дней до первой оплаты',
    difficulty: 'medium',
    dataset: 'events',
    skills: ['julianday', 'MIN', 'AVG'],
    statement: 'Для каждого платящего пользователя посчитайте, через сколько дней после регистрации была первая оплата. Выведите `user_id`, `days_to_pay` (целое число). По `user_id`.',
    solution: `SELECT u.user_id, CAST(julianday(MIN(p.pay_date)) - julianday(u.signup_date) AS INTEGER) AS days_to_pay
FROM users u
JOIN payments p ON p.user_id = u.user_id
GROUP BY u.user_id, u.signup_date
ORDER BY u.user_id;`,
    ordered: true,
  },
  {
    id: 'ab-dirty-users',
    title: 'Проверка чистоты разбиения',
    difficulty: 'easy',
    dataset: 'ab',
    skills: ['Качество данных', 'HAVING'],
    statement: 'Перед анализом A/B-теста проверьте данные: найдите пользователей, которые попали в обе группы. Столбец `user_id`.',
    hint: 'Таких пользователей нужно исключить из анализа — иначе эффект размывается.',
    solution: `SELECT user_id
FROM assignments
GROUP BY user_id
HAVING COUNT(DISTINCT grp) > 1;`,
  },
  {
    id: 'ab-conversion',
    title: 'Конверсия по группам',
    difficulty: 'medium',
    dataset: 'ab',
    skills: ['A/B', 'LEFT JOIN', 'Конверсия'],
    statement: 'Исключив пользователей, попавших в обе группы, посчитайте для каждой группы число пользователей, число покупателей и конверсию в процентах с одним знаком. Столбцы: `grp`, `users`, `buyers`, `conversion_pct`. По названию группы.',
    solution: `WITH clean AS (
  SELECT user_id, MIN(grp) AS grp
  FROM assignments
  GROUP BY user_id
  HAVING COUNT(DISTINCT grp) = 1
), buyers AS (
  SELECT DISTINCT user_id FROM orders
)
SELECT c.grp,
  COUNT(*) AS users,
  COUNT(b.user_id) AS buyers,
  ROUND(100.0 * COUNT(b.user_id) / COUNT(*), 1) AS conversion_pct
FROM clean c
LEFT JOIN buyers b ON b.user_id = c.user_id
GROUP BY c.grp
ORDER BY c.grp;`,
    ordered: true,
  },
  {
    id: 'ab-revenue-per-user',
    title: 'Выручка на пользователя с нулями',
    difficulty: 'medium',
    dataset: 'ab',
    skills: ['A/B', 'COALESCE'],
    statement: 'Исключив пользователей из обеих групп, посчитайте среднюю выручку на пользователя в каждой группе, **учитывая пользователей без покупок как 0**. Столбцы: `grp`, `revenue_per_user` (округлите до одного знака). По группе.',
    hint: 'Частая ошибка — среднее только по покупателям (это ARPPU). Нужна сумма выручки каждого пользователя с COALESCE(…, 0).',
    solution: `WITH clean AS (
  SELECT user_id, MIN(grp) AS grp
  FROM assignments
  GROUP BY user_id
  HAVING COUNT(DISTINCT grp) = 1
), rev AS (
  SELECT user_id, SUM(revenue) AS revenue FROM orders GROUP BY user_id
)
SELECT c.grp, ROUND(AVG(COALESCE(r.revenue, 0)), 1) AS revenue_per_user
FROM clean c
LEFT JOIN rev r ON r.user_id = c.user_id
GROUP BY c.grp
ORDER BY c.grp;`,
    ordered: true,
  },
  {
    id: 'bank-balance',
    title: 'Баланс каждого счёта',
    difficulty: 'easy',
    dataset: 'bank',
    skills: ['SUM', 'LEFT JOIN'],
    statement: 'Посчитайте текущий баланс каждого счёта как сумму всех операций. Выведите `account_id`, `client`, `currency`, `balance`. По номеру счёта.',
    solution: `SELECT a.id AS account_id, c.name AS client, a.currency, COALESCE(SUM(t.amount), 0) AS balance
FROM accounts a
JOIN clients c ON c.id = a.client_id
LEFT JOIN transactions t ON t.account_id = a.id
GROUP BY a.id, c.name, a.currency
ORDER BY a.id;`,
    ordered: true,
  },
  {
    id: 'bank-monthly-spend',
    title: 'Траты по месяцам в рублях',
    difficulty: 'medium',
    dataset: 'bank',
    skills: ['strftime', 'Фильтр по знаку'],
    statement: 'Для рублёвых счетов посчитайте сумму списаний (положительным числом) по каждому клиенту и месяцу. Столбцы: `client`, `month` (`YYYY-MM`), `spent`. Сортировка по клиенту, затем по месяцу.',
    solution: `SELECT c.name AS client, strftime('%Y-%m', t.ts) AS month, -SUM(t.amount) AS spent
FROM transactions t
JOIN accounts a ON a.id = t.account_id
JOIN clients c ON c.id = a.client_id
WHERE a.currency = 'RUB' AND t.amount < 0
GROUP BY c.name, month
ORDER BY client, month;`,
    ordered: true,
  },
  {
    id: 'bank-biggest-spend',
    title: 'Крупнейшее списание каждого клиента',
    difficulty: 'medium',
    dataset: 'bank',
    skills: ['ROW_NUMBER'],
    statement: 'Для каждого клиента, у которого есть списания, найдите его крупнейшее списание по модулю (по всем счетам). Столбцы: `client`, `ts`, `amount`, `category`. По имени клиента.',
    solution: `SELECT client, ts, amount, category
FROM (
  SELECT c.name AS client, t.ts, t.amount, t.category,
    ROW_NUMBER() OVER (PARTITION BY c.id ORDER BY t.amount) AS rn
  FROM transactions t
  JOIN accounts a ON a.id = t.account_id
  JOIN clients c ON c.id = a.client_id
  WHERE t.amount < 0
)
WHERE rn = 1
ORDER BY client;`,
    ordered: true,
  },
  {
    id: 'bank-lag',
    title: 'Интервал между операциями',
    difficulty: 'medium',
    dataset: 'bank',
    skills: ['LAG', 'julianday'],
    statement: 'Для счёта 30 выведите все операции по времени и сколько минут прошло с предыдущей операции этого счёта (для первой — NULL). Столбцы: `id`, `ts`, `minutes_since_prev` (целое).',
    hint: 'LAG(ts) OVER (ORDER BY ts) и разница julianday × 24 × 60.',
    solution: `SELECT id, ts,
  CAST(ROUND((julianday(ts) - julianday(LAG(ts) OVER (ORDER BY ts))) * 24 * 60) AS INTEGER) AS minutes_since_prev
FROM transactions
WHERE account_id = 30
ORDER BY ts;`,
    ordered: true,
  },
  {
    id: 'bank-suspicious',
    title: 'Серия быстрых списаний',
    difficulty: 'hard',
    dataset: 'bank',
    skills: ['Оконные функции', 'Антифрод'],
    statement: 'Антифрод-правило: подозрительна операция-списание, если на этом же счёте было ещё хотя бы два списания в пределах 10 минут **до** неё (включительно с её временем). Выведите `id`, `account_id`, `ts` таких операций. По `id`.',
    hint: 'Самосоединение списаний по счёту с условием на разницу времени, либо окно по счёту и сравнение с LAG(ts, 2).',
    solution: `WITH d AS (
  SELECT id, account_id, ts, LAG(ts, 2) OVER (PARTITION BY account_id ORDER BY ts) AS prev2
  FROM transactions
  WHERE amount < 0
)
SELECT id, account_id, ts
FROM d
WHERE prev2 IS NOT NULL AND (julianday(ts) - julianday(prev2)) * 24 * 60 <= 10
ORDER BY id;`,
    ordered: true,
  },
  {
    id: 'bank-no-activity',
    title: 'Счета без списаний',
    difficulty: 'easy',
    dataset: 'bank',
    skills: ['NOT EXISTS'],
    statement: 'Найдите счета, по которым не было ни одного списания. Столбцы: `account_id`, `client`.',
    solution: `SELECT a.id AS account_id, c.name AS client
FROM accounts a
JOIN clients c ON c.id = a.client_id
WHERE NOT EXISTS (SELECT 1 FROM transactions t WHERE t.account_id = a.id AND t.amount < 0);`,
  },
]
