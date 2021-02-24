const inquirer = require('inquirer');
const cTable = require('console.table');
const {showAll, showAllRole, showAllEmployee} = require('./db/queries');

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
            'update an employee role'
        ]
    }]).then(menuItem=>{
        if(menuItem.menu === 'view all departments'){
            showAll(function(err, result){
                console.table(result);
                promptMenu();
            }, 'department');
        }else if(menuItem.menu === 'view all roles'){
            //showAllRole();
            showAll(function(err, result){
                if (err) console.log("Database error!");
                else {
                    console.table(result);
                    promptMenu();
                }
            }, 'role');
        }else if(menuItem.menu === 'view all employees'){
            showAll(function(err, result){
                console.table(result);
                promptMenu();
            }, 'employee');
        }else if(menuItem.menu === 'add a department'){
            inquirer.prompt([
                {
                    type: 'input',
                    name: 'name',
                    message: "Please Enter New Department Name: "
                } 
            ]).then(deptName =>{
                console.log(deptName);

            })
        }
        
    })
}

promptMenu();
