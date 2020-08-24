USE employee_managementDB;

INSERT INTO departments (name) VALUES ("R&D");
INSERT INTO departments (name) VALUES ("Finance");
INSERT INTO departments (name) VALUES ("Legal");

INSERT INTO roles (title, salary, department_id)
VALUES ("Engineer", 80000, 1);
INSERT INTO roles (title, salary, department_id)
VALUES ("Lead Engineer", 100000, 1);
INSERT INTO roles (title, salary, department_id)
VALUES ("Manager", 120000, 1);
INSERT INTO roles (title, salary, department_id)
VALUES ("Accountant", 100000, 2);
INSERT INTO roles (title, salary, department_id)
VALUES ("Lawyer", 100000, 3);


INSERT INTO employees (first_name, last_name, role_id)
VALUES ("Bill", "Turner", 3);

INSERT INTO employees (first_name, last_name, role_id)
VALUES ("Bart", "Mcdonald", 3);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Kathy", "Simpson", 1, 1);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Ashley", "Simpson", 1, 1);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Brad", "Smith", 1, 2);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Dave", "Smith", 1, 2);

INSERT INTO employees (first_name, last_name, role_id)
VALUES ("Shannon", "Smith", 4);

INSERT INTO employees (first_name, last_name, role_id)
VALUES ("Debra", "Smith", 5);




