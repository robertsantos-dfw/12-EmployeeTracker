// Dependencies
const { connect } = require("http2");
var inquirer = require("inquirer");
var mysql = require("mysql");
var util = require("util");

// MySQL DB Connection Information (remember to change this with our specific credentials)
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "rootroot",
    database: "employeetracker_db",
});

//app.get("/", function(req, res))
// Initiate MySQL Connection.
connection.connect(function(err) {
    if (err) {
        console.error("error connecting: " + err.stack);
        return;
    }
    console.log("connected as id " + connection.threadId);
});

interactWithDB();
connect.query = util.promisify(connection.query);

async function availableRoles() {
    let sql = "select * from role";
    await connection.query(sql, function(err, result) {
        if (err) throw err;
        for (let i = 0; i < result.length; i++) {
            console.table(result[i].title + " " + result[i].salary);

        }
    });
}

async function availableDepartment() {
    let sql = "select * from department";
    await connection.query(sql, function(err, result) {
        if (err) throw err;
        for (let i = 0; i < result.length; i++) {
            console.table(result[i].name);

        }
    });
}

async function availableEmployee() {
    let sql = "select * from employee";
    await connection.query(sql, function(err, result) {
        if (err) throw err;
        for (let i = 0; i < result.length; i++) {
            console.table(`${result[i].first_name}, ${result[i].last_name}`);
        }
    });
}

async function viewEmployeesByManager() {
    let sql = "SELECT * FROM employee WHERE superviserORmanager_id='?'";
    await connection.query(sql, function(err, result) {
        if (err) throw err;
        for (let i = 0; i < result.length; i++) {
            console.table(`${result[i].first_name}, ${result[i].last_name}`);
        }
    });
}

async function viewTheTotalUtilizedBudgetOfADepartment() {
    let sql = "SELECT SUM(role.salary) as total, department.name as name FROM ((role INNER JOIN employee ON role.id = employee.role_id) INNER JOIN department ON role.department_id = department.id) WHERE department.id = ? GROUP BY department.id";
    await connection.query(sql, function(err, result) {
        if (err) throw err;
        for (let i = 0; i < result.length; i++) {
            console.log(`The total utilized budget for ${result[0].name} department is $${result[0].total}`);
        }
    });
}

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
            connection.query("INSERT INTO DEPARTMENT (name) VALUES (?)", function(err, result) {
                if (err) throw err;
                console.log("Department is now added.")
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
                console.log("Role added! Next...");
                interactWithDB();
            }
        );
    });
}

async function addDepartment() {
    inquirer.prompt({
            name: "action",
            type: "input",
            message: "What is the name of the department?",
        })
        .then(function(answer) {
            connection.query("INSERT INTO DEPARTMENTS (name) VALUES (?)", function(err, result) {
                if (err) throw err;
                console.log("Department is now added.")
            })
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
                    addEmployee();
                    break;
            }
        });
}
// a  pp.listen(PORT, function() {
//         console.log("listening on Port: " + PORT);
// });