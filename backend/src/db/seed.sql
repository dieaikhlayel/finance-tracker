-- Run after schema.sql

INSERT INTO categories (name, type) VALUES
  ('Salary',        'INCOME'),
  ('Freelance',     'INCOME'),
  ('Investment',    'INCOME'),
  ('Other Income',  'INCOME'),
  ('Food',          'EXPENSE'),
  ('Transport',     'EXPENSE'),
  ('Shopping',      'EXPENSE'),
  ('Bills',         'EXPENSE'),
  ('Entertainment', 'EXPENSE'),
  ('Health',        'EXPENSE'),
  ('Rent',          'EXPENSE'),
  ('Other Expense', 'EXPENSE');