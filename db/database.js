const mysql = require('mysql2');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'toor',
    database: 'employeetracker_db'
});

connect = () => connection;
disconnect = () => connection.end();


module.exports = {connect, disconnect};