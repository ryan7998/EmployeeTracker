const {connect, disconnect} = require('./database');
const cTable = require('console.table');
const inquirer = require('inquirer');
connection = connect();

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

const addADepartment = (callback) =>{
    inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: "Please Enter New Department Name: "
        } 
    ]).then(deptName =>{
        connection = connect();
        connection.promise().query(`
            INSERT INTO department (name) VALUES
            ('${deptName.name}')
        `).then( ([rows,fields]) => {
            console.log(rows.affectedRows + ' deparment inserted!\n');
            callback();
        })
        .catch(console.log);
    })
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
                callback();
            })
            .catch(console.log);
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
                    console.log(rows.affectedRows + ' new Employee created!\n');
                    callback();
                })
                .catch(console.log);
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
                        callback();
                    })
                    .catch(console.log);
                })
            })
        })

    })
}

const updateEmployeeManager = (callback) =>{

    connection = connect();
    connection.promise().query(`SELECT first_name, last_name from employee`)
    .then( ([rows,fields]) => {
        inquirer.prompt([
            {
                type: 'list',
                name: 'name',
                message: "Please Choose an Employee to update Manager: ",
                choices: rows.map(x => {
                    return x.first_name + " " + x.last_name
                })
            }
        ]).then(empdata =>{
            empName = empdata.name.split(" ");
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'newManager',
                    message: "Please Choose a new Manager: ",
                    choices: rows.map(x => {
                        return x.first_name + " " + x.last_name
                    })
                }
            ]).then(managerdata =>{
                managerName = managerdata.newManager.split(" ");
                connection.promise().query(`
                    SELECT id FROM employee
                    WHERE first_name = '${managerName[0]}' AND last_name = '${managerName[1]}'
                `)
                .then( ([rows,fields]) => {
                    connection.promise().query(`
                        UPDATE employee SET  manager_id = ${rows[0].id}
                        WHERE first_name = '${empName[0]}' AND last_name = '${empName[1]}'
                    `).then(([rows, fields]) => {
                        console.log(rows.affectedRows + ' employee data updated!\n');
                        callback();
                    })
                })
                .catch(console.log);
            })
        })

    })
}

const viewEmpbyManager = (callback) =>{
    // select a.first_name, a.role_id,
    // -> (select b.first_name from employee as b where a.manager_id = b.id)
    // -> from employee as a
    // -> order by
    // -> manager_id;
    connection = connect();
    connection.promise().query(`
        SELECT a.id AS 'Employee Id', a.first_name AS 'First Name', a.last_name AS 'Last Name', 
        (select b.first_name from employee as b where a.manager_id = b.id) AS 'Manager'
        FROM employee AS a
        ORDER BY manager_id
    `)
    .then( ([rows,fields]) => {
        console.table(rows);;
        callback();
    })
    .catch(console.log);
}

const viewEmpbyDept = (callback) =>{
    connection = connect();
    connection.promise().query(`
        SELECT 
            e.id AS 'Employee Id', 
            e.first_name AS 'First Name',
            e.last_name AS 'Last Name', 
            r.title AS 'Job Title',
            d.name AS 'Department'
        FROM employee AS e 
            INNER JOIN role as r ON e.role_id = r.id 
            INNER JOIN department as d ON r.department_id = d.id
    `)
    .then( ([rows,fields]) => {
        console.table(rows);;
        callback();
    })
    .catch(console.log);
}

const deleteByTable =(rows, table, callback) =>{

    if(table === 'department'){

        inquirer.prompt([
            {
                type: 'list',
                name: 'tableName',
                message: 'Choose the department to delete: ',
                choices: rows
            }
        ]).then(data =>{
                connection = connect();
                connection.promise().query(`DELETE FROM department where name = '${data.tableName}'`)
                .then( ([rows,fields]) => {
                    console.log(rows.affectedRows + ' deparment deleted!\n');
                    callback();
                })
                .catch(console.log);
        })
    }else if(table === 'role'){
        inquirer.prompt([
            {
                type: 'list',
                name: 'tableName',
                message: 'Choose the role to delete: ',
                choices: rows
            }
        ]).then(data =>{
                connection = connect();
                connection.promise().query(`DELETE FROM role where title = '${data.tableName}'`)
                .then( ([rows,fields]) => {
                    console.log(rows.affectedRows + ' role deleted!\n');
                    callback();
                })
                .catch(console.log);
        })
    }else if(table === 'employee'){
        inquirer.prompt([
            {
                type: 'list',
                name: 'tableName',
                message: 'Choose the role to delete: ',
                choices: rows
            }
        ]).then(data =>{
            name = data.tableName.split(" ");
            console.log(name[0], name[1]);
            
            connection = connect();
            connection.promise().query(`DELETE FROM employee WHERE first_name = '${name[0]}' AND last_name = '${name[1]}'`)
            .then( ([rows,fields]) => {
                console.log(rows.affectedRows + ' employee deleted!\n');
                callback();
            })
            .catch(console.log);
        })
    }
}

const remove = (callback) =>{
        inquirer.prompt([
            {
                type: 'list',
                name: 'deleteOpt',
                message: "Please Choose what to delete: ",
                choices: ['department', 'role', 'employee']
            }
        ]).then(data =>{
            connection = connect();
            connection.promise().query(`SELECT * FROM ${data.deleteOpt}`)
            .then( ([rows, field])=>{
                if(data.deleteOpt === 'department'){
                    rows = rows.map(x => x.name);
                }else if(data.deleteOpt == 'role'){
                    rows = rows.map(x => x.title);
                }else if(data.deleteOpt == 'employee'){
                    rows = rows.map(x => {
                        return x.first_name + " " + x.last_name
                    })
                }
                deleteByTable(rows, data.deleteOpt, callback);
            })
        }) 
        .catch(console.log);
}

const viewBudget = (callback) =>{
    connection = connect();
    connection.promise().query(`
        SELECT title AS 'Department', SUM(salary) AS 'Budget' 
        FROM role 
        GROUP BY department_id;
    `)
    .then( ([rows, field])=>{
        console.table(rows);;
        callback();
    })
    .catch(console.log)
}

const exit = () =>{
    if(connection){
        connection.end();
        console.log('disconnecting');
    } 
}

module.exports = {
    viewAllDept: viewAllDept,
    viewAllRoles: viewAllRoles,
    viewAllEmployees: viewAllEmployees,
    addADepartment: addADepartment,
    addARole: addARole,
    addEmployee: addEmployee,
    updateEmployeeRole: updateEmployeeRole,
    updateEmployeeManager: updateEmployeeManager,
    viewEmpbyManager: viewEmpbyManager,
    viewEmpbyDept:viewEmpbyDept,
    remove: remove,
    viewBudget: viewBudget,
    exit: exit
}