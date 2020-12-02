-- Drops the programming_db if it already exists --
DROP DATABASE IF EXISTS employeetracker_db;

-- Created the DB "wizard_schools_db" (only works on local connections)
CREATE DATABASE employeetracker_db;

-- Use the DB wizard_schools_db for all the rest of the script
USE employeetracker_db;

-- Created the table "department"
CREATE TABLE department (
  id int AUTO_INCREMENT NOT NULL,
  name varchar(30) NOT NULL,
  PRIMARY KEY(id)
);

-- Inserted a set of records into the table
INSERT INTO department (name)
VALUES ("HR"), ("DEV"), ("IT");


-- Created the table "role"
CREATE TABLE role (
  id int AUTO_INCREMENT NOT NULL,
  title varchar(30) NOT NULL,
  salary DECIMAL,
  department_id INT,
  FOREIGN KEY (department_id) REFERENCES department(ID),
  PRIMARY KEY(id)
);

-- Inserted a set of records into the table
INSERT INTO role (title, salary, departmentid)
VALUES ("manager", 100000, 1), ("clerk", 45000, 1), ("engineer", 80000, 1), ("intern", 35000, 1);


-- Created the table employee
CREATE TABLE employee (
  id int AUTO_INCREMENT NOT NULL,
  first_name varchar(30) NOT NULL,
  last_name varchar(30) NOT NULL,
  role_id INT,
  manager_id INT,
  PRIMARY KEY(id),
  FOREIGN KEY (role_id) REFERENCES roles(id),
  FOREIGN KEY (manager_id) REFERENCES employee(id)
);

-- Inserted a set of records into the table
INSERT INTO employee (first_name, last_name, roleid, managerid)
VALUES ("Robert","Santos", 1, 0), ("Scott","Arnold", 2, 0), ("Captain","America", 3, 0), ("Stan","Lee", 4, 0);

