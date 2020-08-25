const mysql = require(`mysql`);
const inquirer = require(`inquirer`);
const consoleTable = require(`console.table`);
const EmployeeTrackerSql = require(`./employeeTrackerSql`);

const entryPointQuestion = {
    type: `list`,
    name: `entryPoint`,
    message: `what would you like to do?`,
    choices: [
        `view all departments`,
        `view all roles`,
        `view all employees`,
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
        `exit`,
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
        message: `what is the title?`
    },
    {
        type: `input`,
        name: `salary`,
        message: `what is the salary?`
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

const prompt = async (employeeTrackerSql) => {
    inquirer.prompt(entryPointQuestion).then(async (answers) => {
        switch (answers.entryPoint) {
            case `view all departments`: {
                const departments = await employeeTrackerSql.viewDepartments();
                console.log(`\n`);
                console.table(departments);
                break;
            }
            case `view all roles`: {
                const roles = await employeeTrackerSql.viewRoles();
                console.log(`\n`);
                console.table(roles);
                break;
            }
            case `view all employees`: {
                const employees = await employeeTrackerSql.viewEmployees();
                console.log(`\n`);
                console.table(employees);                
                break;
            }
            case `add department`: {
                const answers = await inquirer.prompt([departmentQuestion]);
                if (answers.departmentName) {
                    await employeeTrackerSql.addDepartment(answers.departmentName);
                }
                break;
            }
            case `add role`: {
                let answers = await inquirer.prompt(roleQuestions);
                console.log(`after ${answers}`);
                const title = answers.title;
                const salary = answers.salary;
                const departments = await employeeTrackerSql.viewDepartments();
                answers = await inquirer.prompt({
                    type: `list`,
                    name: `department`,
                    message: `which department does this role belong to?`,
                    choices: departments
                });

                await employeeTrackerSql.addRole(title, salary, answers.department);
                console.log(`after`);
                break;
            }
            case `add employee`: {
                let answers = await inquirer.prompt(employeeQuestions);
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
                const {department_id} = roles.find((role) => {return (role.title === title)});                    
                const managers = await employeeTrackerSql.viewManagersByDepartmentId(department_id);
                const managerNames = managers.map((manager) => {return `${manager.first_name} ${manager.last_name}`});
                
                answers = await inquirer.prompt({
                    type: `list`,
                    name: `manager`,
                    message: `what is the name of the employee's manager?`,
                    choices: managerNames
                });

                const employeeManagerNames = answers.manager.split(` `);
                await employeeTrackerSql.addEmployee(firstName, lastName, title, employeeManagerNames[0], employeeManagerNames[1]);
                break;
            }
            case `update employee role`: {
                const employees = await employeeTrackerSql.viewEmployees();
                const employeeNames = employees.map((employee) => {return `${employee.first_name} ${employee.last_name}`});

                let answers = await inquirer.prompt({
                    type: `list`,
                    name: `employee`,
                    message: `what is the name of the employee?`,
                    choices: employeeNames
                });

                const employeeNamesArray = answers.employee.split(` `);
                const firstName = employeeNamesArray[0];
                const lastName = employeeNamesArray[1];
                const roles = await employeeTrackerSql.viewRoles();
                const titles = roles.map((role) => {return role.title});
                answers = await inquirer.prompt({
                    type: `list`,
                    name: `title`,
                    message: `what is the new title of this employee?`,
                    choices: titles
                });
                
                const title = answers.title;
                await employeeTrackerSql.updateEmployeeRole(firstName, lastName, title);
                break;
            }
            case `update employee manager`: {
                const employees = await employeeTrackerSql.viewEmployees();
                const employeeNames = employees.map((employee) => {return `${employee.first_name} ${employee.last_name}`});

                let answers = await inquirer.prompt({
                    type: `list`,
                    name: `employee`,
                    message: `what is the name of the employee?`,
                    choices: employeeNames
                });

                const employeeNamesArray = answers.employee.split(` `);
                const firstName = employeeNamesArray[0];
                const lastName = employeeNamesArray[1];

                const departmentId = await employeeTrackerSql.getEmployeeDepartmentId(firstName, lastName);
                //assume employee can only have managers from the same department
                const managers = await employeeTrackerSql.viewManagersByDepartmentId(departmentId);
                const managerNames = managers.map((manager) => {return `${manager.first_name} ${manager.last_name}`});

                answers = await inquirer.prompt({
                    type: `list`,
                    name: `manager`,
                    message: `what is the name of the employee's new manager?`,
                    choices: managerNames
                });

                const employeeManagerNames = answers.manager.split(` `);
                
                const managerFirstName = employeeManagerNames[0];
                const managerLastName = employeeManagerNames[1];
                
                await employeeTrackerSql.updateEmployeeManager(firstName, lastName, managerFirstName, managerLastName);
                break;
            }
            case `view employees by manager`: {
                const managers = await employeeTrackerSql.viewManagers();
                //get the manager concatenated first name/ last name from each manager object
                const managerNames = managers.map((manager) => {return manager.manager});
                let answers = await inquirer.prompt({
                    type: `list`,
                    name: `manager`,
                    message: `select manager`,
                    choices: managerNames
                });

                selectedManagerArray = answers.manager.split(` `);                
                const employees = await employeeTrackerSql.viewEmployeesByManager(selectedManagerArray[0], selectedManagerArray[1]);
                console.log(`\n`);
                console.table(employees);
                break;
            }
            case `delete department`: {
                const departments = await employeeTrackerSql.viewDepartments();
                const departmentNames = departments.map((department) => {return department.name});
                const answers = await inquirer.prompt({
                    type: `list`,
                    name: `department`,
                    message: `which department do you intend to delete?`,
                    choices: departmentNames
                });

                await employeeTrackerSql.removeDepartment(answers.department);
                break;
            }
            case `delete role`: {
                const roles = await employeeTrackerSql.viewRoles();
                const titles = roles.map((role) => {return role.title});
                const answers = await inquirer.prompt({
                    type: `list`,
                    name: `title`,
                    message: `which role do you intend to delete?`,
                    choices: titles
                });

                await employeeTrackerSql.removeRole(answers.title);
                break;
            }
            case `delete employee`: {
                const employees = await employeeTrackerSql.viewEmployees();
                const employeeNames = employees.map((employee) => {return `${employee.first_name} ${employee.last_name}`});

                answers = await inquirer.prompt({
                    type: `list`,
                    name: `employee`,
                    message: `what is the name of the employee?`,
                    choices: employeeNames
                });

                const employeeNamesArray = answers.employee.split(` `);
                await employeeTrackerSql.removeEmployee(employeeNamesArray[0], employeeNamesArray[1]);
                break;
            }
            case `view total utilized department budget`: {
                const departments = await employeeTrackerSql.viewDepartments();
                const departmentNames = departments.map((department) => {return department.name});
                const answers = await inquirer.prompt({
                    type: `list`,
                    name: `department`,
                    message: `which department?`,
                    choices: departmentNames
                });

                const departmentBudget = await employeeTrackerSql.viewDepartmentBudget(answers.department);
                console.log(departmentBudget);
                break;
            }
            case `exit`:
                process.exit();
                break;
            default:
                break;
            }
            prompt(employeeTrackerSql); 
        }
    );
}

const connection = mysql.createConnection ({
    host : `localhost`,
    port : 3306,
    user: `root`,
    password: `Kambiz83`,
    database: `employee_managementDB`
});

connection.connect((err) => {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}`);
    prompt(new EmployeeTrackerSql(connection));
});


