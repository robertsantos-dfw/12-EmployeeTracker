// Dependencies
const { connect } = require("http2");
var inquirer = require("inquirer");
var mysql = require("mysql");
var util = require("util");
var cTable = require('console.table');

// MySQL DB Connection Information (remember to change this with our specific credentials)
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "rootroot",
    database: "employeetracker_db",
});


// Initiate MySQL Connection and starts app if connection is good.
connection.connect(function(err) {
    if (err) {
        console.error("error connecting: " + err.stack);
        return;
    }
    console.log("connected as id " + connection.threadId);
    interactWithDB()
});


connect.query = util.promisify(connection.query);

//Starts the questioning function for the app
function interactWithDB() {
    inquirer
        .prompt({
            name: "action",
            type: "rawlist",
            message: "What would you like to do?",
            choices: ["Add", "View", "Update", "Delete", "Exit"],
        })
        .then(function(answer) {
            switch (answer.action) {
                case "Add":
                    add();
                    break;

                case "View":
                    view();
                    break;

                case "Update":
                    update();
                    break;

                case "Delete":
                    toDelete();
                    break;
                case "Exit":
                    process.exit();
                    break;
            }
        });
}



async function availableRoles() {
    let sql = "SELECT *, department.name AS department FROM role INNER JOIN department on department.id = role.department_id;";
    await connection.query(sql, function(err, result) {
        if (err) throw err;
        for (let i = 0; i < result.length; i++) {
            console.table(result[i].department + " " + result[i].title + " " + result[i].salary);
        }
        console.log('What would you like to do next?');
        interactWithDB();
    });
}
async function availableManager() {
    let sql = "select * from employee WHERE role_id = 1;";
    await connection.query(sql, function(err, result) {
        if (err) throw err;
        for (let i = 0; i < result.length; i++) {
            console.table(result[i].first_name + " " + result[i].first_name + " " + result[i].last_name);
        }
        console.log('What would you like to do next?');
        interactWithDB();
    });
}

async function availableDepartment() {
    let sql = "select * from department";
    await connection.query(sql, function(err, result) {
        if (err) throw err;
        for (let i = 0; i < result.length; i++) {
            console.table(result[i].name);

        }
        console.log('What would you like to do next?')
        interactWithDB();
    });
}

async function availableEmployee() {
    let sql = "SELECT * from employeetracker_db.employee LEFT JOIN ROLE on employee.role_id = role.id LEFT join DEPARTMENT on role.department_id = department.id";
    await connection.query(sql, function(err, result) {
        if (err) throw err;
        for (let i = 0; i < result.length; i++) {
            console.table(result[i].title + " " + result[i].first_name + " " + result[i].last_name);

        }
        console.log('What would you like to do next?');
        interactWithDB();
    });
}

async function viewEmployeesByManager() {
    let sql = "SELECT * from employee LEFT JOIN ROLE on employee.role_id = role.id;";
    await connection.query(sql, function(err, result) {
        if (err) throw err;
        for (let i = 0; i < result.length; i++) {
            console.table(`${ result[i].first_name }, ${ result[i].last_name }`);

        }
        console.log('What would you like to do next?');
        interactWithDB();
    });
}

async function viewTheTotalUtilizedBudgetOfADepartment() {
    let departmentChoices = [];

    departmentChoices = await availableDepartment();

    await inquirer
        .prompt({
            name: "action",
            type: "rawlist",
            message: "Which department would you like to view the total utilized budget?",
            choices: departmentChoices
        })
        .then(function(answer) {
            connection.query(
                "SELECT SUM(role.salary) as total, department.name as name FROM ((role INNER JOIN employee ON role.id = employee.role_id) INNER JOIN department ON role.department_id = department.id) WHERE department.id = ? GROUP BY department.id",
                answer.action,
                function(err, result) {
                    if (err) throw err;
                    console.log(`The total utilized budget for ${result[0].name} department is $${result[0].total}`);

                    console.log('What would you like to do next?');
                    interactWithDB();
                }
            );
        });
}



//Define general View departments, roles, employees, employees by manager and the total utilized budget of a department function
function view() {
    inquirer
        .prompt({
            name: "action",
            type: "rawlist",
            message: "What would you like to view?",
            choices: [
                "Departments",
                "Roles",
                "Employees",
                "Employees by manager",
                "The total utilized budget of a department",
            ],
        })
        .then(function(answer) {
            switch (answer.action) {
                case "Departments":
                    availableDepartment();
                    break;

                case "Roles":
                    availableRoles();
                    break;

                case "Employees":
                    availableEmployee();
                    break;

                case "Employees by manager":
                    viewEmployeesByManager();
                    break;

                case "The total utilized budget of a department":
                    viewTheTotalUtilizedBudgetOfADepartment();
                    break;
            }
        });
}

//Define general ADD departments, roles, employees function

async function addDepartment() {
    inquirer.prompt({
            name: "action",
            type: "input",
            message: "What is the name of the department you wish to add?",
        })
        .then(function(answer) {
            connection.query("INSERT INTO department (name) VALUES (?)", answer.action, function(err) {
                if (err) throw err;
                console.log("Department added successfully!");

                console.log('What would you like to do next?')
                interactWithDB();
            })
        });
}

async function addRoles() {
    let myChoices = [];
    const departmentIdName = {};

    availableDepartments();

    const questions = [{
            name: "title",
            type: "input",
            message: "What is the job title for this position?",
        },
        {
            name: "salary",
            type: "input",
            message: "What is the salary for this position?",
        },
        {
            name: "department_Id",
            type: "list",
            message: "Please select the department for this role?",
            choices: myChoices,
        },
    ];

    //function to provide departments as choices and reference it ID to the role
    function availableDepartments() {
        let sql = "SELECT * FROM department";
        connection.query(sql, async function(err, result) {
            if (err) throw err;
            for (let i = 0; i < result.length; i++) {
                myChoices.push(result[i].name);
                departmentIdName[result[i].name] = result[i].id;
            }
        });
    }
    //INSERT data to the DB
    inquirer.prompt(questions).then(function(answer) {
        connection.query(
            "INSERT INTO role (title, salary, department_id) VALUES (?,?,?)", [answer.title, answer.salary, departmentIdName[answer.department_Id]],
            function(err, result) {
                if (err) throw err;
                console.log("The role is now added!");

                console.log('What would you like to do next?')
                interactWithDB();
            }

        );
    });
}

async function addEmployees() {

    //Choices arrays from existing Roles and Managers
    const roleIdName = {};
    let myRoleChoices = [];
    const managerIdName = {};
    let myManagerChoices = [];

    availableRoles();
    availableManager();

    const questions = [{
            name: "firstName",
            type: "input",
            message: "What the employee's first name?",
        },
        {
            name: "lastName",
            type: "input",
            message: "What the employee's last name?",
        },
        {
            name: "roleID",
            type: "list",
            message: "Please select the role/position for this employee?",
            choices: myRoleChoices,
        },
        {
            name: "managerID",
            type: "list",
            message: "Please select the manager/superviser of this employee?",
            choices: myManagerChoices,
        },
    ];

    function availableRoles() {
        let sql = "SELECT * FROM ROLE";
        connection.query(sql, async function(err, result) {
            if (err) throw err;
            for (let i = 0; i < result.length; i++) {
                myRoleChoices.push(result[i].name);
                roleIdName[result[i].name] = result[i].id
            }
        })
    }

    function availableManager() {
        let sql = "select * from employee WHERE role_id = 1";
        connection.query(sql, async function(err, result) {
            if (err) throw err;
            for (let i = 0; i < result.length; i++) {
                myManagerChoices.push(result[i].name);
                managerIdName[result[i].name] = result[i].id
            }
        })
    }

    //Sending question data to build INSERT query
    const answer = await inquirer.prompt(questions);
    connection.query(
        "INSERT INTO employee (first_name, last_name, manager_id, role_id) VALUES (?,?,?,?)", [
            answer.firstName,
            answer.lastName,
            roleIdName[answer.roleID],
            managerIdName[answer.managerID],
        ],
        function(err, result) {
            if (err) throw err;

            console.log(`${ answer.firstName } ${ answer.lastName } was added as an employee.`);
            console.log('What would you like to do next?');
            interactWithDB();
        });
}

function add() {
    inquirer
        .prompt({
            name: "action",
            type: "rawlist",
            message: "What would you like to ADD?",
            choices: [
                "Departments",
                "Roles",
                "Employees",
            ],
        })
        .then(function(answer) {
            switch (answer.action) {
                case "Departments":
                    addDepartment();
                    break;

                case "Roles":
                    addRoles();
                    break;

                case "Employees":
                    addEmployees();
                    break;
            }
        });
}
// a  pp.listen(PORT, function() {
//         console.log("listening on Port: " + PORT);
// });