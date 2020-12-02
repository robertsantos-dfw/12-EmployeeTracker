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
            console.log(result[i].title + " " + result[i].salary);
            //interactWithDB();
        }
    });
}

async function availableDepartment() {
    let sql = "select * from department";
    await connection.query(sql, function(err, result) {
        if (err) throw err;
        for (let i = 0; i < result.length; i++) {
            console.table(result[i].name);
            //interactWithDB();
        }
    });
}



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
// a  pp.listen(PORT, function() {
//         console.log("listening on Port: " + PORT);
// });