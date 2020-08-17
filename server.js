const mysql = require(`mysql`);
const inquirer = require(`inquirer`);
const consoleTable = require(`console.table`);

const entryPointQuestion = {
    type: `list`,
    name: `entryPoint`,
    message: `what would you like to do?`,
    choices: [
        `view all departments`,
        `view all roles`,
        `view all employees`
        `add department`,
        `add role`,
        `add employee`,
        `update employee role`,
        `update employee manager`,
        `view employees by manager`,
        `delete department`,
        `delete role`,
        `delete employee`,
        `view total utilized department budget`,
    ]
};

const prompt = () => {
    inquirer.prompt(entryPointQuestion).then((answers) => {
        const employeeTrackerSql = new EmployeeTrackerSql();
        switch (employeeTrackerSql) {
            
        }
        if (answers.entryPoint === `view`) {
    
        }
    });
    
}

const connection = mysql.createConnection ({
    host : `localhost`,
    port : 3306,
    user: `root`,
    password: `Kambiz82`,
    database: `employeeDb`
});

connection.connect((err) => {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}`);

    prompt();
});


