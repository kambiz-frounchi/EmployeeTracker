DROP DATABASE IF EXISTS employee_managementDB;

CREATE DATABASE employee_managementDB;

USE employee_managementDB;

CREATE TABLE departments (id INT NOT NULL AUTO_INCREMENT, 
                          name VARCHAR(30) NOT NULL,
                          PRIMARY KEY (id));

CREATE TABLE roles (id INT NOT NULL AUTO_INCREMENT,
                    title VARCHAR(30) NOT NULL,
                    salary DECIMAL NOT NULL,
                    department_id INT NULL,
                    PRIMARY KEY (id),
                    FOREIGN KEY (department_id) REFERENCES departments(id));

CREATE TABLE employees (id INT NOT NULL AUTO_INCREMENT,
                        first_name VARCHAR(30) NOT NULL,
                        last_name VARCHAR(30) NOT NULL,
                        role_id INT NULL,
                        manager_id INT NULL,
                        PRIMARY KEY (id),
                        FOREIGN KEY (role_id) REFERENCES roles(id),
                        FOREIGN KEY (manager_id) REFERENCES employees(id));


