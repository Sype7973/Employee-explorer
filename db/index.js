// import database connection
const db = require('./server.js');

const mysql = require('mysql2');

const cTable = require('console.table');



// helper functions for adding employees, roles, and departments using console.table to display the data
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
            const query = 'INSERT INTO department (name) VALUES (?)';
            const [rows, fields] = await db.query(query);
            console.table(rows);
        } catch (err) {
            console.log(err);
        }
    }
    static async removeDepartment() {
        try {
            const query = 'DELETE FROM department WHERE id = ?';
            const [rows, fields] = await db.query(query);
            console.table(rows);
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
            const query = 'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)';
            const [rows, fields] = await db.query(query);
            console.table(rows);
        } catch (err) {
            console.log(err);
        }
    }
    static async removeRole() {
        try {
            const query = 'DELETE FROM role WHERE id = ?';
            const [rows, fields] = await db.query(query);
            console.table(rows);
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
            const query = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';
            const [rows, fields] = await db.query(query);
            console.table(rows);
        } catch (err) {
            console.log(err);
        }
    }
    static async removeEmployee() {
        try {
            const query = 'DELETE FROM employee WHERE id = ?';
            const [rows, fields] = await db.query(query);
            console.table(rows);
        }
        catch (err) {
            console.log(err);
        }

  }
} 