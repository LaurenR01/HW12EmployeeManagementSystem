const inquirer = require('inquirer');
const mysql = require('mysql');
const { exit } = require('process');
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'eXchange12!',
        database: 'ems_db'
    },
    console.log('Connected to the database.')
);

const mainMenu = () => {
    inquirer.prompt([
        {
        type: 'list',
        name: 'todo',
        message: 'What would you like to do?',
        choices: [
         "View existing employee, manager, or department.",
         "Modify employee role",
         "Add new employee, manager, or department",
         "Exit",  
        ],

    },
    ]).then ((answer) => {
        switch (answer.todo) {
            case "View existing employee, manager, or department.":
                viewMenu();
                break;
            case "Modify employee role":
                modifyRole();
                break;
            case "Add new employee, manager, or department":
                addNew();
                break;
            case 'Exit':
                Exit();
                break;
        }
    })
};

const viewMenu = () => {
    inquirer.prompt([
        {
            type: 'list',
            name: 'tasks',
            message: 'What would you like to view?',
            choices: [
                "View all employees",
                "View all employees in a specific role",
                "View all employees assigned to a specific manager",
                "View all employees in a specific department",
                "View a single employee",
            ],
        },
    ]).then((answers => {
        switch (answers.tasks) {
            case "View all employees":
                console.clear();
                viewAll();
                break;
            case "View all employees in a specific role":
                viewAllByRole();
                break;
            case "View all employees assigned to a specific manager":
                viewAllByManager();
                break;
            case "View all employees in a specific department":
                viewAllByDepartment();
                break;
            case "View a single employee":
                viewSingle();
                break;
        }
    }))
};

const viewAll = () =>{
  db .query('SELECT employee.id AS ID, CONCAT(first_name, " ", last_name) AS Employee, role.title AS Role, dept_name AS Department FROM role INNER JOIN employee ON role.id = employee.role_id INNER JOIN department ON role.department.id=department.id', (err, results) => {
  console.log("");
  console.log("All Employees");
  console.table(results);
  console.log("");
  mainMenu();
})
};

const viewAllByRole = () => {
    let roles = [];
    db.query('SELECT title FROM role', (err, results) =>{
        for (let i = 0; i < results.length; i++){
            if(!roles.includes(results[i].title)){
                roles.push(results[i].title);
            };
        }
        console.clear();
        inquirer.prompt([
            {
                type: 'list',
                name: 'role',
                message: 'Which role would you like to view?',
                choices: roles,
            },
        ]).then((answers) =>{
            dq.query('SELECT employee.id AS ID, CONCAT(first_name, " ", last_name) AS Employee, role.title AS Role, dept_name AS Department FROM role INNER JOIN employee ON role.id  = employee.role_id INNER JOIN department ON role.department_id = department.id WHERE role.title = ?', [answer.viewRole], (err, results) => {
            console.log("");
            console.log(`Employees in the role ${answers.role}`);
            console.table(results);
            console.log("");
            mainMenu();
        })
    })
    })
};
const viewAllByManager = () => {
    let managers = [];
    db.query('SELECT CONCAT(manager_name.first_name, " ", manager_name.last_name) AS Manager FROM employee INNER JOIN employee AS manager_name ON employee.manager_id = manager_name.id', (err, results) =>{
        for (let i = 0; i < results.length; i++){
            if(!managers.includes(results[i].Manager)){
                managers.push(results[i].Manager);
            };
        }
        console.clear();
        inquirer.prompt([
            {
                type: 'list',
                name: 'mgr',
                message: 'Which manager would you like to view?',
                choices: managers,
            },
        ]).then((answers) =>{
            dq.query('SELECT CONCAT(employee.first_name, " ", employee.last_name) AS Employee, CONCAT (manager_name.first_name, " ", manager_name.last_name) AS Manager FROM employee INNER JOIN employee AS manager_name ON employee.manager_id = manager_name.id WHERE CONCAT (manager_name.first_name, " ", manager_name.last_name) = ?', [answer.mgr], (err, results) => {
            console.log("");
            console.log(`Employees who work for ${answers.mgr}`);
            console.table(results);
            console.log("");
            mainMenu();
        })
    })
    })
};

const viewAllByDepartment = () => {
    let depts = [];
    db.query('SELECT dept_name from department', (err, results) =>{
        console.log('Results');
        console.log(results);
        for (let i = 0; i < results.length; i++){
            if(!depts.includes(results[i].Department)){
                depts.push(results[i].Department);
            };
        }
        console.clear();
        inquirer.prompt([
            {
                type: 'list',
                name: 'dept',
                message: 'Which department would you like to view?',
                choices: depts,
            },
        ]).then((answers) =>{
            dq.query('SELECT employee.id AS ID, CONCAT(first_name, " ", last_name) AS Employee, dept_name AS Department FROM department, employee, role WHERE employee.manager_id=role.id   AND role.id=department.id AND dept_name = ?', [answer.depts], (err, results) => {
            console.log("");
            console.log(`Employees who work in ${answers.depts}`);
            console.table(results);
            console.log("");
            mainMenu();
        })
    })
})
};

const viewSingle = () => {
    let emps = [];
    db.query('SELECT CONCAT(first_name, " ", last_name) AS Employee FROM employee', (err, results) =>{
        console.log('Results');
        console.log(results);
        for (let i = 0; i < results.length; i++){
            if(!emps.includes(results[i].Employees)){
                emps.push(results[i].Employees);
            };
        }
        console.clear();
        inquirer.prompt([
            {
                type: 'list',
                name: 'viewEmp',
                message: 'Which employee would you like to view?',
                choices: emps,
            },
        ]).then((answers) =>{
            dq.query('SELECT CONCAT(employee.first_name, " ", employee.last_name) AS Employee, role.title AS Title, role.salary AS Salary, department.dept_name AS Department FROM department, employee, role WHERE employee.role_id=role.id AND role. department_id=department.id AND CONCAT(employee.first_name, " ", employee.last_name) = ?', [answer.emps], (err, results) => {
            console.log("");
            console.table(results);
            console.log("");
            mainMenu();
        })
    })
})
};

const modifyRole = () => {
    const employeeList = [];
    db.query('SELECT CONCAT(first_name, " ", last_name) AS Employee FROM employee', (err, results) => {
        for (let i=0; i < results.length; i++){
            if( !employeeList.includes(results[i].Employees)){
                employeeList.push(results[i].Employees);
            };
        };
        inquirer.prompt([
            {
                type: 'list',
                name: 'whoToModify',
                message: 'Which employee would you like to modify?',
                choices: employeeList
            },
        ]).then ((answers) => {
            const empToModify = json.stringify(answer.whoToModify);
            db.query('SELECT title AS roleid from role', (err, results) => {
                for (let i = 0; i < results.length; i++){
                    if(!roles.includes(results[i].roleid)){
                      roles.push(results[i].roleid);
                    };
            };
        inquirer.prompt([
            {
                type: 'list',
                name: 'newRole',
                message: 'What is the new role?',
                choices: roles
            },
        ]).then ((answer) => {
            const roleToUpdate = json.stringify(answer.newRole);
            const fullName = empToModify.replace(/"/g, "");
            const nameObject = fullName.split();

            db.query('SELECT employee.id AS ID FROM employee WHERE first_name = ? AND last_name = ?', [nameObject[0], nameObject[1]],  (err, employeeid) => {

            const rolesID = roleToUpdate.replace(/"/g, "");
            db.query('SELECT id from role where title = ?', [rolesID], (err, rolNum) => {
                r_id = (rolNum[0].id);
                e_id = (empNum[0].ID);


            db.query("UPDATE employee SET employee.role_? WHERE employee.is= ?", [r_id, e_id], (err, results) => {
                console.log("Employee Updated Successfully");
                console.clear();
                mainMenu();

            })
        
        })
        })
        })
    })
    })
})};

const addNew = () => {
    inquirer.prompt ([
        {
        type: 'list',
        name: 'addWhich',
        choices: [
            "Add a new employee",
            "Add a new manager",
            "Add a new department"
        ],
        },
    ]).then ((answer) => {
        switch (answer.addNew) {
            case "Add a new employee":
                console.clear();
                addEmployee();
                break;
            case "Add a new manager":
                addManager();
                break;
            case "Add a new department":
                addDepartment();
                break;
        }
    })
};

const addEmployee = () => {
    const roles = [];
    db.query('SELECT title AS roleid from role', (err, results) => {
        for (let i = 0; i < results.length; i++) {
            if(!roles.includes(results[i].roleid)){
                roles.push(results[i].roleid);
            };
        };
    const managers = [];
    db.query('SELECT CONCAT(manager_name.first_name, " ", manager_name.last_name) AS Manager FROM employee INNER JOIN employee AS manager_name ON employee.manager_id = manager_name.id', (err, results) => {
        for (let i = 0; i < results.length; i++) {
            if(!managers.includes(results[i].Manager)){
                managers.push(results[i].Manager);
            };
        };
       inquirer.prompt([
           {
            type: 'input',
            name: 'employeeFirst',
            message: "What is the employee's first name?",
           },
           {
            type: 'input',
            name: 'employeeLast',
            message: "What is the employee's last name?",
           },
           {
            type: 'list',
            name: 'employeeRole',
            message: "What is the employee's role?",
            choices: roles,
           },
           {
            type: 'list',
            name: 'employeeManager',
            message: "Who is the employee's manager?",
            choices: managers,
           },
       ]).then((answer) => {
        const rolesID = answer.role.replace(/"/g, "");
        db.query('SELECT id from role where title = ?', [rolesID],  (err, rolNum) => {
            r_id = (rolNum[0].id);
        
        const idNum = answer.Manager.replace(/"/g, "");
        db.query('SELECT employee.id FROM CONCAT (employee.first_name, " ", "employee.last_name) = ?'), [idNum], (err, empNum) => {
                e_id = (empNum[0].ID);
        
        db.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [answer.employeeFirst, answer.employeeLast, r_id, e_id], (err, result) => {
        console.clear();
        console.log('New Employee Added');
        mainMenu();
       });
    };
    });
    });
    });
});
};

const addManager = () => {
    const roles = [];
    db.query('SELECT title AS roleid from role', (err, results) =>{
        for (let i = 0; i < results.length; i++) {
        if(!roles.includes(results[i].roleid)){
            roles.push(results[i].roleid);
        };
        };
        inquirer.prompt([
            {
                type: 'input',
                name: 'managerFirst',
                message: "What is the manager's first name?",
               },
               {
                type: 'input',
                name: 'managerLast',
                message: "What is the manager's last name?",
               },
               {
                type: 'list',
                name: 'managerRole',
                message: "What is the manager's role?",
                choices: depts,
               },
            ]).then((answer) => {
             const rolesID = answer.role.replace(/"/g, "");
             db.query('SELECT id from role where title = ?', [rolesID],  (err, rolNum) => {
                    r_id = (rolNum[0].id);

            db.query('INSERT INTO employee (first_name, last_name, role_id, ) VALUES (?, ?, ?)', [answer.managerFirst, answer.managerLast, r_id], (err, result) => {
            console.clear();
            console.log('New Employee Added');
            mainMenu();
            });
        });
    });
    });
};

const addDepartment = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'newDepartment',
            message: "What is the name of the department?",
        },
       
    ]).then((answer) => {
            
    db.query('INSERT INTO department (dept_name) VALUES (?)', [answer.newDepartment], (err, result) => {
            console.clear();
            console.log('New Department Added');
            mainMenu();
            });
        });
    };

const Exit = () =>{
    console.clear();
    console.log("Goodbye");
    process.exit();
}

module.exports = mainMenu