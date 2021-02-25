const inquirer = require('inquirer');
const cTable = require('console.table');
const {viewAllDept, viewAllRoles, viewAllEmployees, addADepartment, addARole, addEmployee, updateEmployeeRole} = require('./db/queries');

 const promptMenu = () =>{
    console.log(`
        ==============================
                Main Menu
        ==============================
    `);
    

    return inquirer.prompt([{
        type: 'list',
        name: 'menu',
        message: 'What would you like to do? ',
        choices: [
            'view all departments', 
            'view all roles', 
            'view all employees',
            'add a department',
            'add a role',
            'add an employee',
            'update an employee role'
        ]
    }]).then(menuItem=>{
        if(menuItem.menu === 'view all departments'){
            viewAllDept(promptMenu);
        }else if(menuItem.menu === 'view all roles'){
            viewAllRoles(promptMenu);
        }else if(menuItem.menu === 'view all employees'){
           viewAllEmployees(promptMenu);
        }else if(menuItem.menu === 'add a department'){
            inquirer.prompt([
                {
                    type: 'input',
                    name: 'name',
                    message: "Please Enter New Department Name: "
                } 
            ]).then(deptName =>{
                addADepartment(deptName.name, promptMenu);
            })
        }else if(menuItem.menu === 'add a role'){
            addARole(promptMenu);
        }else if(menuItem.menu === 'add an employee'){
            addEmployee(promptMenu);
        }else if(menuItem.menu === 'update an employee role'){
            updateEmployeeRole(promptMenu);
        }
    })
}

promptMenu();
