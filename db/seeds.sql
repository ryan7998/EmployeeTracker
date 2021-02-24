insert into department (name) values
('Sales'),
('Engineering'),
('Finance'),
('Legal');

insert into role (title, salary, department_id) values
('Sales Lead', 100000, 1),
('Salesperson', 80000, 1),
('Lead Engineer', 150000, 2),
('Software Engineer', 120000, 2),
('Accountant', 125000, 3),
('Legal Team lead', 250000, 4),
('Lawyer', 190000, 4);


insert into employee (first_name, last_name, role_id, manager_id) values
('Isabel', 'Munz', 1, NULL),
('Anissa', 'Gossage', 2, 1),
('Ervin', 'Scholes', 3, NULL),
('Jarod', 'Edgley', 4, 3),
('Merilyn', 'Abrahamson', 5, 1),
('Werner', 'Renolds', 6, NULL),
('Marivel', 'Mcadams', 7, 6),
('Basil', 'Forward', 2, 1),
('Kym', 'Leveille', 4, 3),
('Tangela', 'Alva', 5, 1),
('Anton', 'Polizzi', 7, 6),
('Marvella', 'Onstad', 2, 1),
('Vida', 'Abbe', 4, 3),
('Bree', 'Hendry', 7, NULL),
('Angie', 'Topping', 1, NULL),
('Gracie', 'Higginbottom', 2, NULL),
('Jaclyn', 'Ciesla', 3, NULL);


