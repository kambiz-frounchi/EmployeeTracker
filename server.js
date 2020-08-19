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
        type: `input`,
        name: `title`,
        message : `what is the title?`
    },
    {
        type: `input`,
        name: `salary`,
        message : `what is the salary?`
    }
];

const employeeQuestions = [
    {
        type: `input`,
        name: `firstName`,
        message : `what is the employee's first name?`
    },
    {
        type: `input`,
        name: `lastName`,
        message : `what is the employee's last name?`
    },
    {
        type: `input`,
        name: `managerFirstName`,
        message : `what is the employee's manager?`
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
                const answers = await inquirer.prompt([roleQuestions]);
                const title = answers.title;
                const salary = answers.salary;
                const departments = await employeeTrackerSql.viewDepartments();
                answers = await inquirer.prompt({
                    type: `list`,
                    name: `department`,
                    message: `which department does this role belong to?`,
                    choices: departments
                });

                employeeTrackerSql.addRole(title, salary, answers.department);
                break;
            case `add employee`:
                const answers = await inquirer.prompt([employeeQuestions]);
                const firstName = answers.firstName;
                const lastName = answers.lastName;
                const roles = await employeeTrackerSql.viewRoles();
                const titles = roles.map((role) => {return role.title});
                answers = await inquirer.prompt({
                    type: `list`,
                    name: `title`,
                    message: `what is the title of this employee?`,
                    choices: titles
                });

                const title = answers.title;
                const {department} = roles.find((role) => {return (role.title === title)});
                
                const managers = await employeeTrackerSql.viewManagersByDepartment(department);
                const managerNames = managers.map((manager) => {return `${manager.first_name} ${manager.last_name}`});

                answers = await inquirer.prompt({
                    type: `list`,
                    name: `manager`,
                    message: `what is the name of the employee's manager?`,
                    choices: managerNames
                });

                const employeeManagerNames = managerNames.split();


                employeeTrackerSql.addEmployee(answers.firstName, answers.lastName, title,
                                               employeeManagerNames[0], employeeManagerNames[1]);
                break;
            
            default:
                break;
            }
                
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


