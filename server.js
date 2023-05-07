// import npm packages
const express = require('express');
const util = require('util');
const inquirer = require('inquirer');
// Import and require mysql2
const mysql = require('mysql2');
require('dotenv').config();

// import query functions
const { 
  viewAllEmployees,
  viewAllEmployeesByDepartment, 
  viewAllEmployeesByManager, 
  addEmployee, 
  removeEmployee, 
  updateEmployeeRole, 
  updateEmployeeManager 
} = require('./db/index.js');

const PORT = process.env.PORT || 8080;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    // MySQL username,
    DB_USER,
    // TODO: Add MySQL password here
    DB_PASSWORD,
    DB_NAME,
  },
  console.log(`Connected to the employee_db database.`)
);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// inquirer prompts that lead to other questions after asking certain questions
const promptUser = async () => {
  const prompt = util.promisify(inquirer.prompt);

  const data = await prompt([
    {
      type: 'list',
      name: 'options',
      message: 'What would you like to do?',
      choices: ['View All Employees', 'View All Employees by Department', 'View All Employees by Manager', 'Add Employee', 'Remove Employee', 'Update Employee Role', 'Update Employee Manager', 'View All Roles', 'Add Role', 'Remove Role', 'View All Departments', 'Add Department', 'Remove Department', 'View Total Utilized Budget of a Department', 'Exit']
    },
  ]);

  switch (data.options) {
    case 'View All Employees':
      viewAllEmployees();
      break;
    case 'View All Employees by Department':
      viewAllEmployeesByDepartment();
      break;
    case 'View All Employees by Manager':
      viewAllEmployeesByManager();
      break;
    case 'Add Employee':
      addEmployee();
      break;
    case 'Remove Employee':
      removeEmployee();
      break;
    case 'Update Employee Role':
      updateEmployeeRole();
      break;
    case 'Update Employee Manager':
      updateEmployeeManager();
      break;
    case 'View All Roles':
      viewAllRoles();
      break;
    case 'Add Role':
      addRole();
      break;
    case 'Remove Role':
      removeRole();
      break;
    case 'View All Departments':
      viewAllDepartments();
      break;
    case 'Add Department':
      addDepartment();
      break;
    case 'Remove Department':
      removeDepartment();
      break;
    case 'View Total Utilized Budget of a Department':
      viewTotalUtilizedBudgetOfDepartment();
      break;
    case 'Exit':
      db.end();
      break;
  }
};

promptUser();



// export connection to database for ORM
module.exports = db;