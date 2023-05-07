const db = require('../server');
const inquirer = require('inquirer');
// helper functions for adding employees, roles, and departments using 
// console.table to display the data
// also includes input for inquirer prompts
class Department {
    constructor(id, name) {
      this.id = id;
      this.name = name;
    }
  
    static async getAllDepartments() {
      try {
        const query = 'SELECT * FROM department';
        const [rows, fields] = await db.query(query);
        console.table(rows);
      } catch (err) {
        console.log(err);
      }
    }
  
    static async addDepartment() {
      try {
        const { name } = await inquirer.prompt([
          {
            name: 'name',
            type: 'input',
            message: 'Enter the department name:',
          },
        ]);
  
        const query = 'INSERT INTO department (name) VALUES (?)';
        const [rows, fields] = await db.query(query, [name]);
        console.log(`Department ${name} added successfully`);
      } catch (err) {
        console.log(err);
      }
    }
  }
  
  class Role {
    constructor(id, title, salary, department_id) {
      this.id = id;
      this.title = title;
      this.salary = salary;
      this.department_id = department_id;
    }
  
    static async getAllRoles() {
      try {
        const query = 'SELECT * FROM role';
        const [rows, fields] = await db.query(query);
        console.table(rows);
      } catch (err) {
        console.log(err);
      }
    }
  
    static async addRole() {
      try {
        const departments = await db.query('SELECT * FROM department');
        const departmentChoices = departments[0].map((department) => ({
          name: department.name,
          value: department.id,
        }));
  
        const { title, salary, departmentId } = await inquirer.prompt([
          {
            name: 'title',
            type: 'input',
            message: 'Enter the role title:',
          },
          {
            name: 'salary',
            type: 'input',
            message: 'Enter the role salary:',
          },
          {
            name: 'departmentId',
            type: 'list',
            message: 'Select the department for the role:',
            choices: departmentChoices,
          },
        ]);
  
        const query = 'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)';
        const [rows, fields] = await db.query(query, [title, salary, departmentId]);
        console.log(`Role ${title} added successfully`);
      } catch (err) {
        console.log(err);
      }
    }
  }
  
class Employee {
    constructor(id, first_name, last_name, role_id, manager_id) {
      this.id = id;
      this.first_name = first_name;
      this.last_name = last_name;
      this.role_id = role_id;
      this.manager_id = manager_id;
    }
  
    static async getAllEmployees() {
      try {
        const query = 'SELECT * FROM employee';
        const [rows, fields] = await db.query(query);
        console.table(rows);
      } catch (err) {
        console.log(err);
      }
    }
  
    static async addEmployee() {
      try {
        const { first_name, last_name, role_id, manager_id } = await inquirer.prompt([
          {
            name: 'first_name',
            type: 'input',
            message: "Enter the employee's first name:",
          },
          {
            name: 'last_name',
            type: 'input',
            message: "Enter the employee's last name:",
          },
          {
            name: 'role_id',
            type: 'input',
            message: "Enter the employee's role ID:",
          },
          {
            name: 'manager_id',
            type: 'input',
            message: "Enter the employee's manager ID:",
          },
        ]);
  
        const query = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';
        const [rows, fields] = await db.query(query, [first_name, last_name, role_id, manager_id]);
        console.table(rows);
      } catch (err) {
        console.log(err);
      }
    }
  
    static async removeEmployee() {
      try {
        const { id } = await inquirer.prompt([
          {
            name: 'id',
            type: 'input',
            message: "Enter the ID of the employee you'd like to remove:",
          },
        ]);
  
        const query = 'DELETE FROM employee WHERE id = ?';
        const [rows, fields] = await db.query(query, [id]);
        console.table(rows);
      } catch (err) {
        console.log(err);
      }
    }
  }
// export the classes
module.exports = { Department, Role, Employee };
