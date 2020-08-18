const mysql = require(`mysql`);
const inquirer = require(`inquirer`);
const consoleTable = require(`console.table`);
const employeeTrackerSql = new (require(`./employeeTrackerSql`));

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

const departmentQuestion = {
    type: `input`,
    name: `departmentName`,
    message: `what is the name of the department?`,
};

const roleQuestions = [
    {
        type: `input`;
        name: `title`,
        message : `what is the title?`
    },
    {
        type: `input`,
        name: `salary`,
        message : `what is the salary?`
    },
    {
        type: `input`;
        name: `departmentName`,
        message : `what department does this role pertain to?`
    }
];

const prompt = async () => {
    inquirer.prompt(entryPointQuestion).then((answers) => {
        switch (answers.entryPoint) {
            case `view all departments`:
                employeeTrackerSql.viewDepartments((results) => {
                    consoleTable(results);
                });
                break;
            case `view all roles`:
                employeeTrackerSql.viewRoles((results) => {
                    consoleTable(results);
                });
                break;
            case `view all employees`:
                employeeTrackerSql.viewEmployees((results) => {
                    consoleTable(results);
                });                
                break;
            case `add department`:
                const answers = await inquirer.prompt([departmentQuestion]);
                if (answers.departmentName) {
                    employeeTrackerSql.addDepartment(answers.departmentName);
                }
                break;
            case `add role`:

                employeeTrackerSql.addRole()
            
            
        }
    });
    
}

const connection = mysql.createConnection ({
    host : `localhost`,
    port : 3306,
    user: `root`,
    password: `Kambiz83`,
    database: `employeeDb`
});

connection.connect((err) => {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}`);

    prompt();
});


