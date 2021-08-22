USE ems_db;

INSERT INTO department (id, dept_name)
    VALUES
        (01, "Human Resources"),
        (02, "Sales"),
        (03, "Customer Service");

INSERT INTO role (id, title, department_id)
    VALUES
        (001, "HR Representative", 01),
        (002, "HR Manager", 01),
        (003, "Sales Representative", 02),
        (004, "Sales Manager", 02),
        (005, "CS Representative", 03),
        (006, "Customer Service Manager", 03);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
    VALUES
        (0001, "John", "Smith", 001, 002),
        (0002, "Lauren", "Rowe", 002, 002),
        (0003, "Kristen", "Cramer", 003, 004),
        (0004, "Gena", "Roley", 004, 004),
        (0005, "Andrew", "Tovinitti", 005, 006),
        (0006, "Avin", "Molden", 006, 006),
        (0007, "Rachel", "Phillips", 003, 004),
        (0008, "Laura", "Bryer", 005, 006),
        (0009, "Michelle", "Guidos", 001, 002);