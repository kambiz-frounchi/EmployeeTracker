const mysql = require(`mysql`);

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
});

module.exports = connection;