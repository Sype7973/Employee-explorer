-- create seeds for department, role, employee
INSERT INTO department (name)
VALUES ('Sales'),
       ('Engineering'),
       ('Finance'),
       ('Legal');

INSERT INTO Role (title, salary, department_id)
VALUES ('Sales Lead', 100000.00, 1),
       ('Account Manager', 80000.00, 1),
       ('Lead Engineer', 150000.00, 2),
       ('Software Engineer', 120000.00, 2),
       ('Financial Officer', 125000.00, 3),
       ('Legal Compliance Officer', 250000.00, 4),
       ('Lawyer', 190000.00, 4);

INSERT INTO employee (first_name, last_name, salary, role_id, manager_id)
VALUES  ('John', 'Smith', 100000.00, 1, NULL),
        ('Mike', 'Lee', 80000.00, 2, 1),
        ('Ashley', 'Stephenson', 80000.00, 2, 1),
        ('Adam', 'Day', 120000.00, 4, 2),
        ('Jacob', "Rollo", 150000.00, 3, NULL),
        ('Kevin', 'Bacon', 120000.00, 4, 2),
        ('Tory', 'Brown', 125000.00, 5, NULL),
        ('Sarah', 'Ladley', 250000.00, 6, NULL),
        ('Bob', 'Philips', 190000.00, 7, 3),
        ('Samantha', 'Jones', 190000.00, 7, 3);