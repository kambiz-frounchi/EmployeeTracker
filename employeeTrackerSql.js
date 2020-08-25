const mysql = require (`mysql`);

//this class defines all API required to conduct SQL queries to the employee_managementDB
class EmployeeTrackerSql {
   constructor (connection) {
       this.connection = connection;
   }
   
   addDepartment(name) {
        return new Promise((resolve, reject) => {
            const queryString = "INSERT INTO departments SET ?";
            const post = {name : name};
            this.connection.query(queryString, post, (err, results) => {
                    if (err) return reject(err);
                    resolve();
            });
        });
   }

    addRole(title, salary, departmentName) {
         return new Promise((resolve, reject) => {
            let queryString = "SELECT (id) FROM departments WHERE ?";
            this.connection.query(queryString, [{name : departmentName}], (err, results) => {
                if (err) reject(err);
                queryString = "INSERT INTO roles SET ?";
                const post = {title: title, salary: salary, department_id: results[0].id};
                this.connection.query(queryString, post, (err, results) => {
                    if (err) reject(err);
                    resolve();
                });
            });
        });
    }

    addEmployee(firstName, lastName, title, managerFirstName, managerLastName) {
        console.log(firstName, lastName, title, managerFirstName, managerLastName);
        return new Promise((resolve, reject) => { 
            let queryString = "SELECT (id) FROM roles WHERE ?";
            this.connection.query(queryString, {title : title}, (err, results) => {
                if (err) return reject(err);
                const roleId = results[0].id;
                queryString = "SELECT (id) FROM employees WHERE ? AND ?";
                this.connection.query(queryString, [{first_name : managerFirstName}, {last_name : managerLastName}], (err, results) => {
                    if (err) return reject(err);
                    const managerId = results[0].id;
                    const queryString = "INSERT INTO employees SET ?";
                    const post = {first_name: firstName, last_name : lastName, role_id: roleId, manager_id: managerId};
                    this.connection.query(queryString, post, (err, results) => {
                        if (err) return reject(err);
                        resolve();
                    });
                });
            });
        });
    }

    removeDepartment(name) {
        return new Promise((resolve, reject) => { 
            const queryString = "DELETE FROM departments WHERE name = ?";
            this.connection.query(queryString, [name], (err, results) => {
                if (err) return reject(err);
                resolve();
            });
        });
    }

    removeRole(title) {
        console.log(title);
        return new Promise((resolve, reject) => {
            const queryString = "DELETE FROM roles WHERE title = ?";
            this.connection.query(queryString, [title], (err, results) => {
                if (err) return reject(err);
                resolve();
            });
        });
    }

    removeEmployee(firstName, lastName) {
        return new Promise((resolve, reject) => {
            const queryString = "DELETE FROM employees WHERE first_name = ? AND last_name = ?";
            const post = [firstName, lastName];
            this.connection.query(queryString, post, (err, results) => {
                if (err) return reject(err);
                resolve();
            });
        });
    }

    viewDepartments() {
        const queryString = "SELECT * FROM departments";
        return new Promise((resolve, reject) => {
            this.connection.query(queryString, (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    }

    viewRoles() {
        const queryString = "SELECT title, salary, departments.name AS department FROM roles LEFT JOIN departments ON roles.department_id = departments.id";
        return new Promise((resolve, reject) => {
            this.connection.query(queryString, (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    }

    viewEmployees() {
        let queryString = "SELECT e.first_name, e.last_name, roles.title AS role, roles.salary, departments.name AS department, IFNULL (CONCAT(m.first_name, ' ', m.last_name), NULL) AS manager FROM employees e";
        queryString += " LEFT JOIN roles ON e.role_id = roles.id LEFT JOIN departments ON roles.department_id = departments.id LEFT JOIN employees m ON e.manager_id = m.id";
        return new Promise((resolve, reject) => {
            this.connection.query(queryString, (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    }

    //assumes there are no two employees with same firstName and lastName
    updateEmployeeRole(firstName, lastName, title) {
        return new Promise((resolve, reject) => {
            let queryString = "SELECT (id) FROM roles WHERE ?";
            this.connection.query(queryString, [{title : title}], (err, results) => {
                if (err) return reject(err);
                const roleId = results[0].id;
                queryString = "UPDATE employees SET ? WHERE ? AND ?";
                this.connection.query(queryString, [{role_id : roleId}, {first_name : firstName}, {last_name : lastName}], (err, results) => {
                    if (err) return reject(err);
                    resolve();
                });
            });
        });
    }

    //assumes there are no two employees with same firstName and lastName
    updateEmployeeManager(firstName, lastName, managerFirstName, managerLastName) {
        console.log(firstName, lastName, managerFirstName, managerLastName);
        return new Promise((resolve, reject) => {
            let queryString = "SELECT (id) FROM employees WHERE ?";
            this.connection.query(queryString, [{first_name : managerFirstName}, {last_name : managerLastName}], (err, results) => {
                if (err) return reject();
                const managerId = results[0].id;
                queryString = "UPDATE employees SET ? WHERE ? AND ?";
                this.connection.query(queryString, [{manager_id : managerId}, {first_name : firstName}, {last_name : lastName}], (err, results) => {
                    if (err) return reject();
                    resolve();
                });
            });
        });
    }

    viewEmployeesByManager(managerFirstName, managerLastName) {
        return new Promise((resolve, reject) => {
            let queryString = "SELECT e.first_name, e.last_name, roles.title AS role, roles.salary, departments.name AS department, IFNULL (CONCAT(m.first_name, ' ', m.last_name), NULL) AS manager FROM employees e";
            queryString += " LEFT JOIN roles ON e.role_id = roles.id LEFT JOIN departments ON roles.department_id = departments.id LEFT JOIN employees m ON e.manager_id = m.id WHERE  m.first_name = ? AND m.last_name = ?";                
            this.connection.query(queryString, [managerFirstName, managerLastName], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });    
    }

    /*
    View the total utilized budget of a department -- ie the combined salaries of all employees in that department
    */
    viewDepartmentBudget(departmentName) {
        console.log(departmentName);
        return new Promise((resolve, reject) => {
            const queryString = "SELECT (roles.salary) FROM employees LEFT JOIN roles ON employees.role_id = roles.id LEFT JOIN departments ON roles.department_id = departments.id WHERE ?";
            this.connection.query(queryString, [{"departments.name" : departmentName}], (err, results) => {
                let sum = 0;
                if (err) return reject(err);
                results.forEach((employee) => {
                    sum += employee.salary;
                });
                resolve(sum);
            });
        });
    }

    viewManagers() {
        return new Promise((resolve, reject) => {
            const queryString = "SELECT CONCAT(employees.first_name, ' ', employees.last_name) AS manager FROM employees WHERE employees.manager_id IS NULL";
            this.connection.query(queryString, (err, results) => {
                if (err) return reject(err);
                resolve(results);
         });
     });        
    }

    viewManagersByDepartmentId(departmentId) {
        return new Promise((resolve, reject) => {
               const queryString = "SELECT employees.first_name, employees.last_name FROM employees LEFT JOIN roles ON employees.role_id=roles.id LEFT JOIN departments ON roles.department_id = departments.id WHERE departments.id = ? AND employees.manager_id IS NULL";
               this.connection.query(queryString, departmentId, (err, results) => {
                    if (err) return reject(err);
                    resolve(results);
            });
        });
    }

    getEmployeeDepartmentId(firstName, lastName) {
        return new Promise((resolve, reject) => {
            let queryString = "SELECT departments.id FROM employees LEFT JOIN roles ON employees.role_id = roles.id LEFT JOIN departments ON roles.department_id = departments.id";
            queryString += " WHERE first_name = ? AND last_name = ?";
            this.connection.query(queryString, [firstName, lastName], (err, results) => {
                if (err) return reject(err);
                resolve(results[0].id);
            });
        });
    }
}

module.exports = EmployeeTrackerSql;