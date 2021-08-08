const inquirer = require('inquirer');
const mysql = require('mysql2');
const { exit } = require('process');
const dq = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'root',
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
    ]).then ((answers) => {
        switch (answers.todo) {
            case "View existing employee, manager, or department":
                console.clear();
                viewMenu();
                break;
            case "Modify Employee Role":
                modifyRole();
                break;
            case "Add new employee, managerm or department":
                addMenu();
                break;
            case 'Exit':
                exit();
                break;
        }
    })
}