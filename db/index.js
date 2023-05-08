// import npm packages
const inquirer = require('inquirer');
const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection(
    {
      host: 'localhost',
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    },
    console.log(`Connected to the employee_db database.`)
  ).promise();

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
          return rows;
        } catch (err) {
          console.log(err);
          throw err;
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
          return rows;
        } catch (err) {
          console.log(err);
          throw err;
        }
    }

    static async removeDepartment() {
        try {
          const departments = await db.query('SELECT * FROM department');
          const departmentChoices = departments[0].map((department) => ({
            name: department.name,
            value: department.id,
          }));
  
          const { departmentId } = await inquirer.prompt([
            {
              name: 'departmentId',
              type: 'list',
              message: 'Select the department to remove:',
              choices: departmentChoices,
            },
          ]);
  
          const query = 'DELETE FROM department WHERE id = ?';
          const [rows, fields] = await db.query(query, [departmentId]);
          console.log(`Department removed successfully`);
          return rows;
        } catch (err) {
          console.log(err);
          throw err;
        }
        }
        static async viewDepartmentBudget() {
          try {
            const departments = await db.query('SELECT * FROM department');
            const departmentChoices = departments[0].map((department) => ({
              name: department.name,
              value: department.id,
            }));
    
            const { departmentId } = await inquirer.prompt([
              {
                name: 'departmentId',
                type: 'list',
                message: 'Select the department to view budget:',
                choices: departmentChoices,
              },
            ]);
    
            const query = 'SELECT SUM(salary) FROM role WHERE department_id = ?';
            const [rows, fields] = await db.query(query, [departmentId]);
            console.log(`Department budget viewed successfully`);
            console.table(rows);
          }
          catch (err) {
            console.log(err);
            throw err;
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
          return rows;
        } catch (err) {
          console.log(err);
          throw err;
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
          return rows;
        } catch (err) {
          console.log(err);
          throw err;
        }
    }
    static async removeRole() {
      try {
        const roles = await db.query('SELECT * FROM role');
        const roleChoices = roles[0].map((role) => ({
          name: role.title,
          value: role.id,
        }));
      
        const { roleId } = await inquirer.prompt([
          {
            name: 'roleId',
            type: 'list',
            message: 'Select the role to remove:',
            choices: roleChoices,
          },
        ]);
        
        const query = 'DELETE FROM role WHERE id = ?';
        const [rows, fields] = await db.query(query, [roleId]);
        console.log(`Role removed successfully`);
        return rows;
      } catch (err) {
        console.log(err);
        throw err;
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

    static async updateEmployeeRole() {
        try {
            const employees = await db.query('SELECT * FROM employee');
            const employeeChoices = employees[0].map((employee) => ({
                name: `${employee.first_name} ${employee.last_name}`,
                value: employee.id,
            }));

            const roles = await db.query('SELECT * FROM role');
            const roleChoices = roles[0].map((role) => ({
                name: role.title,
                value: role.id,
            }));

            const { employeeId, roleId } = await inquirer.prompt([
                {
                    name: 'employeeId',
                    type: 'list',
                    message: 'Select the employee to update:',
                    choices: employeeChoices,
                },
                {
                    name: 'roleId',
                    type: 'list',
                    message: 'Select the new role:',
                    choices: roleChoices,
                },
            ]);

            const query = 'UPDATE employee SET role_id AS `employee_role` = ? WHERE id = ?';
            const [rows, fields] = await db.query(query, [roleId, employeeId]);
            console.log(`Employee role updated successfully`);
        } catch (err) {
            console.log(err);
        }
    }
}
// export the classes
module.exports = { Department, Role, Employee };
