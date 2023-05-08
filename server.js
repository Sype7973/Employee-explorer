// import npm packages
const inquirer = require('inquirer');
// Import and require mysql2
const mysql = require('mysql2');
// Import and require console.table
require('dotenv').config();

// import query functions
const { Employee, Role, Department } = require('./db/index.js');

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  console.log(`Connected to the employee_db database.`)
);
db.connect((err) => {
  if (err)console.log(err)
});

// inquirer prompts that lead to other questions using the classes imported for each table
const promptUser = async () => {
  try {
    while (true) {
      const { action } = await inquirer.prompt({
        name: 'action',
        type: 'list',
        message: 'What would you like to do?',
        choices: [
          'View all employees',
          'View all departments',
          'View all roles',
          'Add an employee',
          'Add a department',
          'Add a role',
          'Update an employee role',
          'Remove an employee',
          'Remove a department',
          'Remove a role',
          "View Department's Budget",
          'Exit',
        ],
      });
      switch (action) {
        case 'View all employees':
          await Employee.getAllEmployees();
          break;
        case 'View all departments':
          await Department.getAllDepartments();
          break;
        case 'View all roles':
          await Role.getAllRoles();
          break;
        case 'Add an employee':
          await Employee.addEmployee();
          break;
        case 'Add a department':
          await Department.addDepartment();
          break;
        case 'Add a role':
          await Role.addRole();
          break;
        case 'Update an employee role':
          await Employee.updateEmployeeRole();
          break;
        case 'Remove an employee':
          await Employee.removeEmployee();
          break;
        case 'Remove a department':
          await Department.removeDepartment();
          break;
        case 'Remove a role':
          await Role.removeRole();
          break;
        case "View Department's Budget":
          await Department.viewDepartmentBudget();
          break;
        case 'Exit':
          db.end();
          console.log('Goodbye!');
          return;
        default:
          console.log(`Invalid action: ${action}`);
          break;
      }
    }
  } catch (err) {
    console.log(err);
  }
};

promptUser();


// export connection to database for ORM
module.exports = db;