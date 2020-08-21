const mysql = require (`mysql`);

//this class defines all API required to conduct SQL queries to the employee_managementDB
class EmployeeTrackerSql {
   constructor (connection) {
       this.connection = connection;
   }
   
   addDepartment(name) {
       const queryString = "INSERT INTO departments SET ?";
       const post = {name : name};
       connection.query(queryString, post, (err, results) => {
            if (err) throw err;
       });
   }

    addRole(title, salary, departmentName) {
        const queryString = "SELECT (id) FROM departments WHERE ?";
        this.connection.query(queryString, [{title : title}], (err, results) => {
            if (err) throw err;
            queryString = "INSERT INTO departments SET ?";
            const post = {title: title, salary: salary, department_id: results[0]};
            connection.query(queryString, post, (err, results) => {
                if (err) throw err;
            });
        });
    }

    addEmployee(firstName, lastName, title, managerFirstName, managerLastName) {
        const queryString = "SELECT (id) FROM roles WHERE ?";
        this.connection.query(queryString, {title : title}, (err, results) => {
            if (err) throw err;
            const roleId = results[0];
            queryString = "SELECT (id) FROM employees WHERE ? AND ?";
            this.connection.query(queryString, [{first_name : managerFirstName}, {last_name : managerLastName }], (err, results) => {
                if (err) throw err;
                const managerId = results[0];
                const queryString = "INSERT INTO employees SET ?";
                const post = {first_name: first_name, last_name : last_name, role_id: roleId, manager_id: managerId};
                this.connection.query(queryString, post, (err, results) => {
                    if (err) throw err;
                });
            });       
        });
    }

    removeDepartment(name) {
        const queryString = "DELETE FROM departments WHERE ?";
        const post = {name : name};
        connection.query(queryString, post, (err, results) => {
             if (err) throw err;
        });
    }

    removeRole(title) {
        const queryString = "DELETE FROM roles WHERE ?";
        const post = {title : title};
        connection.query(queryString, post, (err, results) => {
             if (err) throw err;
        });
    }

    removeEmployee(firstName, lastName) {
        const queryString = "DELETE FROM employees WHERE ? AND ?";
        const post = [{first_name : firstName}, {last_name : lastName}];
        connection.query(queryString, post, (err, results) => {
             if (err) throw err;
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
        const queryString = "SELECT * FROM roles";
        return new Promise((resolve, reject) => {
            this.connection.query(queryString, (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    }

    viewEmployees() {
        const queryString = "SELECT * FROM employees";
        return new Promise((resolve, reject) => {
            this.connection.query(queryString, (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    }

    updateEmployeeRole(firstName, lastName, title) {
        const queryString = "SELECT (id) FROM roles WHERE ?";
        this.connection.query(queryString, [{title : title}], (err, results) => {
            if (err) throw err;
            const roleId = results[0];
            queryString = "UPDATE employees SET ? WHERE ? AND ?";
            this.connection.query(queryString, [{role_id : roleId}, {first_name : firstName}, {last_name : last_name}], (err, results) => {
                if (err) throw err;
            });
        });    
    }

    updateEmployeeManager(firstName, lastName, managerFirstName, managerLastName) {
        const queryString = "SELECT (id) FROM employees WHERE ?";
        this.connection.query(queryString, [{first_name : managerFirstName}, {last_name : managerLastName}], (err, results) => {
            if (err) throw err;
            const managerId = results[0];
            queryString = "UPDATE employees SET ? WHERE ? AND ?";
            this.connection.query(queryString, [{manager_id : managerId}, {first_name : firstName}, {last_name : last_name}], (err, results) => {
                if (err) throw err;
            });
        });        
    }

    viewEmployeesByManager(managerFirstName, managerLastName) {
        return new Promise((resolve, reject) => {
            const queryString = "SELECT (id) FROM employees WHERE ? AND ?";
            this.connection.query(queryString, [{"first_name" : managerFirstName}, {"last_name" : managerLastName}], (err, results) => {
                if (err) return reject(err);
                queryString = "SELECT * from employees WHERE ?";
                this.connection.query(queryString, [{manager_id : results[0].id}], (err, results) => {
                    if (err) return reject(err);
                    resolve(results);
                });
            });
        });       
    }

    /*
    View the total utilized budget of a department -- ie the combined salaries of all employees in that department
    */
    viewDepartmentBudget(departmentName) {
        const queryString = "SELECT (roles.salary) FROM employees LEFT JOIN roles ON ? LEFT JOIN departments ON ? WHERE ?";
        this.connection.query(queryString, [{"employees.role_id" : "roles.id"}, {"roles.department_id" : "departments.id"}, {"department.names" : "R&D"}], (err, results) => {
            const sum = 0;
            if (err) throw err;
            results.forEach((employeeSalary) => {
                sum += employeeSalary;
            });
        });
    }

    viewManagersByDepartment(departmentName) {
        return new Promise((resolve, reject) => {
            const queryString = "SELECT (employees.first_name, employees.last_name FROM employees LEFT JOIN roles ON ? LEFT JOIN departments ON ? WHERE ? AND employees.manager_id IS NULL";
            this.connection.query(queryString, [{"employees.role_id" : "roles.id"}, {"roles.department_id" : "departments.id"}, {"departments.name" : departmentName}], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    }
}

module.exports = EmployeeTrackerSql;