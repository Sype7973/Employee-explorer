# Employee-explorer

## Description

- My motivation for this project was to create a command line interface that employers could use to manage their employee database
- I built this project to help employers manage their employee database, I also wanted to use mySQL to access a database and understand schemas
- This project solves the problem of having to manually update a database, it allows the user to update the database through the command line
- I learned how challenging mySQL syntax can be, I also learned how to use inquirer to create a command line interface with different cases.

## Installation

- To install this project, clone the repository from github, then run npm install to install the dependencies, then run node index.js to start the program.



## Usage

- To use this project, run node index.js, then select the option you would like to use, then follow the prompts
- To remove a department or role you must first remove all employees in that department or role.
- To remove a manager you must first assign them to another role.
- To remove an employee you must first remove them from any roles they are assigned to. You will receive an error message if trying to remove a role that has an employee assigned to it or an employee that has an assigned manager.

Link to video of CLI in use:

https://drive.google.com/file/d/1r8u86mB3OYW3DyckVXuD-wGa3FnDVeT6/view


![Screenshot of the command line interface in action](/img/screencap.PNG)

## Features

- You can view the total budget of a department
- You can delete a department, role, or employee
- You can update an employee's role


Thank you for using my app!
