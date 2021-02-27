const inquirer = require('inquirer');
const cTable = require('console.table');
const {
        viewAllDept, 
        viewAllRoles, 
        viewAllEmployees, 
        addADepartment, 
        addARole, 
        addEmployee, 
        updateEmployeeRole, 
        updateEmployeeManager,
        viewEmpbyManager,
        viewEmpbyDept,
        remove,
        viewBudget,
        exit
    } = require('./db/queries');

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
            'update an employee role',
            'update employee managers',
            'view employees by manager',
            'view employees by department',
            'delete',
            'view the total utilized budget',
            'exit',
            new inquirer.Separator()
        ]
    }]).then(menuItem=>{
        if(menuItem.menu === 'view all departments'){
            viewAllDept(promptMenu);
        }else if(menuItem.menu === 'view all roles'){
            viewAllRoles(promptMenu);
        }else if(menuItem.menu === 'view all employees'){
           viewAllEmployees(promptMenu);
        }else if(menuItem.menu === 'add a department'){
            addADepartment(promptMenu);
        }else if(menuItem.menu === 'add a role'){
            addARole(promptMenu);
        }else if(menuItem.menu === 'add an employee'){
            addEmployee(promptMenu);
        }else if(menuItem.menu === 'update an employee role'){
            updateEmployeeRole(promptMenu);
        }else if (menuItem.menu === 'update employee managers'){
            updateEmployeeManager(promptMenu);
        }else if (menuItem.menu === 'view employees by manager'){
            viewEmpbyManager(promptMenu);
        }else if (menuItem.menu === 'view employees by department'){
            viewEmpbyDept(promptMenu);
        }else if (menuItem.menu === 'delete'){
            remove(promptMenu);
        }else if(menuItem.menu === 'view the total utilized budget'){
            viewBudget(promptMenu);
        }else{
            exit();
            console.log('exit');
            process.exit()
        }
    })
}

promptMenu();
