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
    console.log('\x1b[32m%s\x1b[0m', `Connected to the employee_db database.`)
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
          console.log('\x1b[32m%s\x1b[0m', `Department ${name} added successfully`);
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
    
        const rolesInDepartment = await db.query('SELECT * FROM role WHERE department_id = ?', [departmentId]);
        const roleIds = rolesInDepartment[0].map((role) => role.id);
        if (roleIds.length > 0) {
          const idsString = roleIds.join(',');
          await db.query(`DELETE FROM employee WHERE department_id IN (${idsString})`);
        } else {
          console.log('No roleIds found to delete employees from');
        }
        await db.query('DELETE FROM role WHERE department_id = ?', [departmentId]);
        await db.query('DELETE FROM department WHERE id = ?', [departmentId]);
    
        console.log('\x1b[32m%s\x1b[0m', `Department removed successfully, along with ${rolesInDepartment[0].length} associated roles`);
      } catch (err) {
        console.log("Could not remove department, as it's associated with an active role");
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
              // group by statement, and need to join the employee/department tables to create the budget
              // use joining statements; d.name, join role r ON e.role_id; r.department_id = d.id is a join condition which specifies we want to join the role and department 
              const query = 'SELECT d.name AS department, SUM(e.salary) AS total_budget FROM employee e JOIN role r ON e.role_id = r.id JOIN department d ON r.department_id = d.id WHERE d.id = ? GROUP BY d.id';
              const [rows, fields] = await db.query(query, [departmentId]);
              console.log('\x1b[32m%s\x1b[0m',`Department budget viewed successfully`);
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
          console.log('\x1b[32m%s\x1b[0m',`Role ${title} added successfully`);
          return rows;
        } catch (err) {
          console.log(err);
          throw err;
        }
    }
    static async removeRole() {
      try {
        // Prompt the user to select a role to remove
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
    
        // Check if there are any employees assigned to the selected role
        const [employeeRows] = await db.query('SELECT COUNT(*) as count FROM employee WHERE role_id = ?', [roleId]);
        if (employeeRows[0].count > 0) {
          console.log(`Cannot remove role: there are ${employeeRows[0].count} employees assigned to this role.`);
          return;
        }
    
        // Delete the selected role
        const [rows, fields] = await db.query('DELETE FROM role WHERE id = ?', [roleId]);
        console.log('\x1b[32m%s\x1b[0m',`Role removed successfully`);
        return rows;
      } catch (err) {
        console.log('Could not remove role, as it is assigned to one or more employees');
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
  // this function will get all employees from the database
  // the query will join the employee and role tables to display roles
  // the query will also display the employee's first name, last name, role, and manager
    static async getAllEmployees() {
      try {
        const query = `
          SELECT e.*, r.title
          FROM employee e
          JOIN role r ON e.role_id = r.id
        `;
        const [rows, fields] = await db.query(query);
        console.table(rows);
      } catch (err) {
        console.log(err);
      }
    }
    // this function will prompt the user to add an employee
    // the user will be prompted to enter the employee's first name, last name, role id, and manager id
    // the role id and manager id will be used to determine the employee's role and manager
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
    
        const query = 'SELECT salary FROM role WHERE id = ?';
        const [rows, fields] = await db.query(query, [role_id]);
        const { salary } = rows[0];
    
        const insertQuery = 'INSERT INTO employee (first_name, last_name, salary, role_id, manager_id) VALUES (?, ?, ?, ?, ?)';
        const [insertRows, insertFields] = await db.query(insertQuery, [first_name, last_name, salary, role_id, manager_id]);
        console.log('\x1b[32m%s\x1b[0m',`${first_name} ${last_name} added successfully`);
      } catch (err) {
        console.log(err);
      }
    }
    // this function removes an employee from the database
    // it selects all employees from the database
    // then prompts the user to select an employee to remove
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
            console.log('\x1b[32m%s\x1b[0m', `Employee removed successfully`);
        } catch (err) {
            console.log('Could not remove employee, as they are assigned to one or more managers');
        }
    }
    // this function updates an employee role by selecting the employee 
    // and role from the database and updating the employee's role
    // with the new role
    // it selects all employees and all roles from the database
    // then prompts the user to select an employee and a new role
    // then updates the employee's role with the new role
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

            const query = 'UPDATE employee SET role_id = ? WHERE id = ?';
            const [rows, fields] = await db.query(query, [roleId, employeeId]);
            console.log('\x1b[32m%s\x1b[0m', `Employee role updated successfully`);
        } catch (err) {
            console.log(err);
        }
    }
}
// export the classes
module.exports = { Department, Role, Employee };
