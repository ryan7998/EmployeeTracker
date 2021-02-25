const {connect, disconnect} = require('./database');
const cTable = require('console.table');
const inquirer = require('inquirer');

const viewAllDept = (callback) =>{
    connection = connect();
    connection.promise().query(`SELECT name as 'Department Name', id as 'Department Id' from department`)
    .then( ([rows,fields]) => {
        console.table(rows);;
        callback();
    })
    .catch(console.log)
}
const viewAllRoles = (callback) =>{
    connection = connect();
    connection.promise().query(`
        SELECT role.title AS 'Job Title', role.id AS 'Role Id', department.name AS 'Department', role.salary AS 'Salary' 
        FROM role LEFT JOIN department 
        ON department_id = department.id
    `)
    .then( ([rows,fields]) => {
        console.table(rows);;
        callback();
    })
    .catch(console.log);
}

const viewAllEmployees = (callback) =>{
    connection = connect();
    connection.promise().query(`
        SELECT a.id AS 'Employee Id', a.first_name AS 'First Name', a.last_name AS 'Last Name', 
        role.title AS 'Job Title', department.name AS 'Department', role.salary AS 'Salary',
        (select b.first_name from employee as b where a.manager_id = b.id) AS 'Manager'
        FROM employee AS a 
            LEFT JOIN role ON a.role_id = role.id 
            LEFT JOIN department ON role.department_id = department.id
        ORDER BY a.id
    `)
    .then( ([rows,fields]) => {
        console.table(rows);;
        callback();
    })
    .catch(console.log);
}


const addADepartment = (deptName, callback) =>{
    connection = connect();
    // console.log(deptName);
    connection.promise().query(`
        INSERT INTO department (name) VALUES
        ('${deptName}')
    `).then( ([rows,fields]) => {
        // console.log(rows, fields);;
        console.log(rows.affectedRows + ' deparment inserted!\n');
        callback();
    })
    .catch(console.log);
    
}

const addARole = (callback) =>{
    connection = connect();
    connection.promise().query(`SELECT name from department`)
    .then( ([rows,fields]) => {
        // console.log(rows); return;
        inquirer.prompt([
            {
                type: 'input',
                name: 'name',
                message: "Please Enter New Role Name: "
            },
            {
                type: 'input',
                name: 'salary',
                message: "Please Enter Salary for that Role: "
            },
            {
                type: 'list',
                name: 'department',
                message: "Please Choose a Department: ",
                choices: rows
            }
        ]).then(chosenDept =>{
            // console.log(chosenDept);
            connection.promise().query(`
                INSERT INTO ROLE (title, salary, department_id) VALUES
                ('${chosenDept.name}', ${chosenDept.salary}, (select id from department where name = '${chosenDept.department}'))
            `).then( ([rows,fields]) => {
                // console.log(rows, fields);;
                console.log(rows.affectedRows + ' deparment inserted!\n');
            })
            .catch(console.log);
            callback();
        })
    })
    .catch(console.log);
}

const addEmployee = (callback) => {
    connection = connect();
    connection.promise().query(`SELECT title from role`)
    .then( ([roleRows,fields]) => {
        connection.promise().query(`SELECT first_name from employee`)
        .then( ([employeeRows,fields]) => {
            inquirer.prompt([
                {
                    type: 'input',
                    name: 'firstName',
                    message: "Please Enter First Name of the new Employee: "
                },
                {
                    type: 'input',
                    name: 'lastName',
                    message: "Please Enter Last Name of the new Employee: "
                },
                {
                    type: 'list',
                    name: 'role',
                    message: "Please Choose a Role: ",
                    choices: roleRows.map(x => x.title)
                },
                {
                    type: 'list',
                    name: 'manager',
                    message: "Please Choose a Manager: ",
                    choices: employeeRows.map(x => x.first_name)
                }
            ]).then(data =>{
                connection = connect();
                connection.promise().query(`
                INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
                    ('${data.firstName}', '${data.lastName}', (select id from role where title = '${data.role}'), 
                    (select P.id from employee P where P.first_name = '${data.manager}')) 
                `).then( ([rows,fields]) => {
                    // console.log(rows, fields);;
                    console.log(rows.affectedRows + ' deparment inserted!\n');
                })
                .catch(console.log);
                callback();
            })
        })
    })
}

const updateEmployeeRole = (callback) =>{
    connection = connect();
    connection.promise().query(`SELECT first_name, last_name from employee`)
    .then( ([rows,fields]) => {
        inquirer.prompt([
            {
                type: 'list',
                name: 'name',
                message: "Please Choose an Employee to update: ",
                choices: rows.map(x => {
                    return x.first_name + " " + x.last_name
                })
            }
        ]).then(empdata =>{
            name = empdata.name.split(" ");
            console.log(name[0], name[1]);
            connection.promise().query(`SELECT title from role`)
            .then(([rows, fields])=>{
                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'title',
                        message: "Please Choose an Employee to update: ",
                        choices: rows.map(x => x.title)
                    }
                ]).then(roledata =>{
                    connection.promise().query(`
                        UPDATE employee SET role_id = 
                        (SELECT id FROM role WHERE title = '${roledata.title}' ) 
                        WHERE first_name = '${name[0]}' AND last_name = '${name[1]}' LIMIT 1
                    `)
                    .then( ([rows,fields]) => {
                        console.log(rows.affectedRows + ' employee data updated!\n');
                    })
                    .catch(console.log);
                    callback();

                })
            })
        })

    })
}

module.exports = {
    viewAllDept: viewAllDept,
    viewAllRoles: viewAllRoles,
    viewAllEmployees: viewAllEmployees,
    addADepartment: addADepartment,
    addARole: addARole,
    addEmployee: addEmployee,
    updateEmployeeRole: updateEmployeeRole
}