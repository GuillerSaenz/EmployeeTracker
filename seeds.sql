-- Department Table
INSERT INTO department (name) VALUES ('Engineering');
INSERT INTO department (name) VALUES ('Legal');
INSERT INTO department (name) VALUES ('Finance');
INSERT INTO department (name) VALUES ('Sales');

-- Role Table
INSERT INTO role (title, salary, department_id) VALUES ('Software Engineer', 90000, 1);
INSERT INTO role (title, salary, department_id) VALUES ('HR Manager', 75000, 2);
INSERT INTO role (title, salary, department_id) VALUES ('Accountant', 80000, 3);
INSERT INTO role (title, salary, department_id) VALUES ('Marketing Specialist', 70000, 4);

-- Employee Table
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('John', 'Doe', 1, NULL);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Jane', 'Smith', 2, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Sara', 'Connor', 3, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Tom', 'Hanks', 4, 2);