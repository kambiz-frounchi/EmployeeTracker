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
    } 
];

const managerQuestions = [
    {
        type: `input`,
        name: `firstName`,
        message : `what is the employee's new manager's first name?`
    },
    {
        type: `input`,
        name: `lastName`,
        message : `what is the employee's new manager's last name?`
    }
];

const prompt = async () => {
    inquirer.prompt(entryPointQuestion).then((answers) => {
        switch (answers.entryPoint) {
            case `view all departments`:
                employeeTrackerSql.viewDepartments()
                .then((results) => {
                    consoleTable(results);
                });
                break;
            case `view all roles`:
                employeeTrackerSql.viewRoles()
                .then((results) => {
                    consoleTable(results);
                });
                break;
            case `view all employees`:
                employeeTrackerSql.viewEmployees()
                .then((results) => {
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
                    type: `input`,
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
                    type: `input`,
                    name: `title`,
                    message: `what is the title of this employee?`,
                    choices: titles
                });

                const title = answers.title;
                const {department} = roles.find((role) => {return (role.title === title)});
                
                const managers = await employeeTrackerSql.viewManagersByDepartment(department);
                const managerNames = managers.map((manager) => {return `${manager.first_name} ${manager.last_name}`});

                answers = await inquirer.prompt({
                    type: `input`,
                    name: `manager`,
                    message: `what is the name of the employee's manager?`,
                    choices: managerNames
                });

                const employeeManagerNames = answers.manager.split();
                employeeTrackerSql.addEmployee(answers.firstName, answers.lastName, title,
                                               employeeManagerNames[0], employeeManagerNames[1]);
                break;
            case `update employee role`:
                const employees = await employeeTrackerSql.viewEmployees();
                const employeeNames = employee.map((employee) => {return `${employee.first_name} ${employee.last_name}`});

                const answers = await inquirer.prompt({
                    type: `input`,
                    name: `employee`,
                    message: `what is the name of the employee?`,
                    choices: employeeNames
                });

                const employeeNamesArray = answers.employee.split();
                const firstName = employeeNamesArray[0];
                const lastName = employeeNamesArray[1]
                const roles = await employeeTrackerSql.viewRoles();
                const titles = roles.map((role) => {return role.title});
                answers = await inquirer.prompt({
                    type: `input`,
                    name: `title`,
                    message: `what is the new title of this employee?`,
                });
                
                const title = answers.title;
                employeeTrackerSql.updateEmployeeRole(firstName, lastName, title);
                break;
            case `update employee manager`:
                const employees = await employeeTrackerSql.viewEmployees();
                const employeeNames = employee.map((employee) => {return `${employee.first_name} ${employee.last_name}`});

                const answers = await inquirer.prompt({
                    type: `input`,
                    name: `employee`,
                    message: `what is the name of the employee?`,
                    choices: employeeNames
                });

                const employeeNamesArray = answers.employee.split();
                const firstName = employeeNamesArray[0];
                const lastName = employeeNamesArray[1];

                const managers = await employeeTrackerSql.viewManagersByDepartment(department);
                const managerNames = managers.map((manager) => {return `${manager.first_name} ${manager.last_name}`});

                answers = await inquirer.prompt({
                    type: `input`,
                    name: `manager`,
                    message: `what is the name of the employee's manager?`,
                    choices: managerNames
                });

                const employeeManagerNames = answers.manager.split();
                
                const managerFirstName = employeeManagerNames[0];
                const managerLastName = employeeManagerNames[1];
                
                employeeTrackerSql.updateEmployeeManager(firstName, lastName, managerFirstName, managerLastName);
                break;
            case `view employees by manager`:
                const answers = await inquirer.prompt(managerQuestions);

                const managerFirstName = answers.managerFirstName;
                const managerLastName = answers.managerLastName;
                
                employeeTrackerSql.viewEmployeesByManager(managerFirstName, managerLastName, (results) => {
                    consoleTable(results);
                });
                break;
            case `delete department`:
                const departments = await employeeTrackerSql.viewDepartments();
                const departmentNames = departments.map((department) => {return department.name});
                const answers = await inquirer.prompt({
                    type: `input`,
                    name: `department`,
                    message: `which department do you intend to delete?`,
                    choices: departmentNames
                });

                employeeTrackerSql.removeDepartment(answers.department);
                break;
            case `delete role`:
                const roles = await employeeTrackerSql.viewRoles();
                const titles = departments.map((role) => {return role.title});
                const answers = await inquirer.prompt({
                    type: `input`,
                    name: `title`,
                    message: `which title do you intend to delete?`,
                    choices: titles
                });

                employeeTrackerSql.removeRole(answers.title);
                break;
            case `delete employee`:
                const employees = await employeeTrackerSql.viewEmployees();
                const employeeNames = employees.map((employee) => {return `${employee.first_name} ${employee.last_name}`});

                answers = await inquirer.prompt({
                    type: `input`,
                    name: `employee`,
                    message: `what is the name of the employee?`,
                    choices: employeeNames
                });

                const employeeNamesArray = answers.employee.split();
                employeeTrackerSql.removeEmployee(employeeNamesArray[0], employeeNamesArray[1]);
                break;
            case `view total utilized department budget`:
                const departments = await employeeTrackerSql.viewDepartments();
                const departmentNames = departments.map((department) => {return department.name});
                const answers = await inquirer.prompt({
                    type: `input`,
                    name: `department`,
                    message: `which department?`,
                    choices: departmentNames
                });

                employeeTrackerSql.viewDepartmentBudget(answers.departmentName);
                break;
            default:
                break;
            }          
        }
    );
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


