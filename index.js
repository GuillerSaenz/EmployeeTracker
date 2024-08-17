const inquirer = require("inquirer");

const {EmployeeTracker} = require("./EmployeeTracker");

const employeeTracker = new EmployeeTracker();

let isFirstRun = true;

const mainMenuQuestions = [
	{
		type: "list",
		name: "menu",
		message: "What do you want to do?",
		choices: [
			"view all departments",
			"view all roles",
			"view all employees",
			"view employees by manager",
			"view employees by department",
			"view total budget by department",
			"add a department",
			"add a role",
			"add an employee",
			"update an employee role",
			"update an employee manager",
			"delete a department",
			"delete a role",
			"delete an employee",
		],
	},
];
function createViewEmployeesByManagerQuestions(managers) {
	return [
		{
			type: "list",
			name: "manager",
			message: "Which manager's employees do you want to see?",
			choices: managers.map((manager) => `${manager.first_name} ${manager.last_name}`),
			filter(answer) {
				const selectedManager = managers.find((manager) => `${manager.first_name} ${manager.last_name}` === answer);
				return selectedManager ? selectedManager.id : null;
			},
		},
	];
}
function createViewEmployeesByDepartmentQuestions(departments) {
	return [
		{
			type: "list",
			name: "department",
			message: "Which department's employees do you want to see?",
			choices: departments.map((department) => department.name),
			filter(answer) {
				const selectedDepartment = departments.find((department) => department.name === answer);
				return selectedDepartment ? selectedDepartment.id : null;
			},
		},
	];
}
function createViewTotalBudgetByDepartmentQuestions(departments) {
	return [
		{
			type: "list",
			name: "department",
			message: "From which department do you want to see the total budget?",
			choices: departments.map((department) => department.name),
			filter(answer) {
				const selectedDepartment = departments.find((department) => department.name === answer);
				return selectedDepartment ? selectedDepartment.id : null;
			},
		},
	];
}
const addDepartmentQuestions = [
	{
		type: "input",
		name: "department",
		message: "What is the name of the department?",
	},
];
function createAddRoleQuestions(departments) {
	return [
		{
			type: "input",
			name: "title",
			message: "What is the name of the role?",
		},
		{
			type: "input",
			name: "salary",
			message: "What is the salary of the role?",
		},
		{
			type: "list",
			name: "department_id",
			message: "Which department does the role belong to?",
			choices: departments.map((department) => department.name),
			filter(answer) {
				const selectedDepartment = departments.find((department) => department.name === answer);
				return selectedDepartment ? selectedDepartment.id : null;
			},
		},
	];
}
function createAddEmployeeQuestions(roles, employees) {
	const updatedEmployees = [{ id: null, first_name: "None" }, ...employees];
	return [
		{
			type: "input",
			name: "first_name",
			message: "What is the employee's first name?",
		},
		{
			type: "input",
			name: "last_name",
			message: "What is the employee's last name?",
		},
		{
			type: "list",
			name: "role_id",
			message: "What is the employee's role?",
			choices: roles.map((role) => role.title),
			filter(answer) {
				const selectedRole = roles.find((role) => role.title === answer);
				return selectedRole ? selectedRole.id : null;
			},
		},
		{
			type: "list",
			name: "manager_id",
			message: "Who is the employee's manager?",
			choices: updatedEmployees.map((employee) => (employee.last_name ? `${employee.first_name} ${employee.last_name}` : employee.first_name)),
			filter(answer) {
				const selectedEmployee = updatedEmployees.find((employee) => {
					const name = employee.last_name ? `${employee.first_name} ${employee.last_name}` : employee.first_name;
					return name === answer;
				});
				return selectedEmployee ? selectedEmployee.id : null;
			},
		},
	];
}
function createUpdateEmployeeRoleQuestions(employees, roles) {
	return [
		{
			type: "list",
			name: "employee_id",
			message: "Which employee do you want to update the role for?",
			choices: employees.map((employee) => `${employee.first_name} ${employee.last_name}`),
			filter(answer) {
				const selectedEmployee = employees.find((employee) => `${employee.first_name} ${employee.last_name}` === answer);
				return selectedEmployee ? selectedEmployee.id : null;
			},
		},
		{
			type: "list",
			name: "role_id",
			message: "Which role do you want to assign to the employee?",
			choices: roles.map((role) => role.title),
			filter(answer) {
				const selectedRole = roles.find((role) => role.title === answer);
				return selectedRole ? selectedRole.id : null;
			},
		},
	];
}
function createUpdateEmployeeManagerQuestions(employees) {
	return [
		{
			type: "list",
			name: "employee_id",
			message: "Which employee do you want to update their manager for?",
			choices: employees.map((employee) => `${employee.first_name} ${employee.last_name}`),
			filter(answer) {
				const selectedEmployee = employees.find((employee) => `${employee.first_name} ${employee.last_name}` === answer);
				return selectedEmployee ? selectedEmployee.id : null;
			},
		},
		{
			type: "list",
			name: "manager_id",
			message: "Which employee do you want to be their new manager?",
			choices: employees.map((employee) => `${employee.first_name} ${employee.last_name}`),
			filter(answer) {
				const selectedEmployee = employees.find((employee) => `${employee.first_name} ${employee.last_name}` === answer);
				return selectedEmployee ? selectedEmployee.id : null;
			},
		},
	];
}
function createDeleteDepartmentQuestions(departments) {
	return [
		{
			type: "list",
			name: "department",
			message: "Which department do you want to delete?",
			choices: departments.map((department) => department.name),
			filter(answer) {
				const selectedDepartment = departments.find((department) => department.name === answer);
				return selectedDepartment ? selectedDepartment.id : null;
			},
		},
	];
}
function createDeleteRoleQuestions(roles) {
	return [
		{
			type: "list",
			name: "role",
			message: "Which role do you want to delete?",
			choices: roles.map((role) => role.title),
			filter(answer) {
				const selectedRole = roles.find((role) => role.title === answer);
				return selectedRole ? selectedRole.id : null;
			},
		},
	];
}
function createDeleteEmployeeQuestions(employees) {
	return [
		{
			type: "list",
			name: "employee",
			message: "Which employee do you want to delete?",
			choices: employees.map((employee) => `${employee.first_name} ${employee.last_name}`),
			filter(answer) {
				const selectedEmployee = employees.find((employee) => `${employee.first_name} ${employee.last_name}` === answer);
				return selectedEmployee ? selectedEmployee.id : null;
			},
		},
	];
}

function manageViewEmployeesByManager(answers) {
	employeeTracker.viewEmployeesByManager(answers.manager, init);
}
function manageViewEmployeesByDepartment(answers) {
	employeeTracker.viewEmployeesByDepartment(answers.department, init);
}
function manageViewTotalBudgetByDepartment(answers) {
	employeeTracker.viewTotalBudgetByDepartment(answers.department, init);
}
function manageAddDepartment(answers) {
	employeeTracker.addDepartment(answers.department, init);
}
function manageAddRole(answers) {
	employeeTracker.addRole(answers, init);
}
function manageAddEmployees(answers) {
	employeeTracker.addEmployee(answers, init);
}
function manageUpdateEmployeeRole(answers) {
	employeeTracker.updateEmployeeRole(answers, init);
}
function manageUpdateEmployeeManager(answers) {
	employeeTracker.updateEmployeeManager(answers, init);
}
function manageDeleteDepartment(answers) {
	employeeTracker.deleteDepartment(answers.department, init);
}
function manageDeleteRole(answers) {
	employeeTracker.deleteRole(answers.role, init);
}
function manageDeleteEmployee(answers) {
	employeeTracker.deleteEmployee(answers.employee, init);
}

async function manageMainMenu(answers) {
	let departments;
	let roles;
	let employees;
	switch (answers.menu) {
		case "view all departments":
			await employeeTracker.viewAllDepartments(init);
			break;
		case "view all roles":
			await employeeTracker.viewAllRoles(init);
			break;
		case "view all employees":
			await employeeTracker.viewAllEmployees(init);
			break;
		case "view employees by manager":
			const managers = await employeeTracker.getAllManagers();
			const viewEmployeesByManagerQuestions = createViewEmployeesByManagerQuestions(managers);
			inquirer
				.prompt(viewEmployeesByManagerQuestions)
				.then(manageViewEmployeesByManager)
				.catch((error) => {
					if (error.isTtyError) {
						console.error("Prompt couldn't be rendered in the current environment");
					} else {
						console.error("Something else went wrong", error);
					}
					init();
				});
			break;
		case "view employees by department":
			departments = await employeeTracker.getAllDepartments();
			const viewEmployeesByDepartmentQuestions = createViewEmployeesByDepartmentQuestions(departments);
			inquirer
				.prompt(viewEmployeesByDepartmentQuestions)
				.then(manageViewEmployeesByDepartment)
				.catch((error) => {
					if (error.isTtyError) {
						console.error("Prompt couldn't be rendered in the current environment");
					} else {
						console.error("Something else went wrong", error);
					}
					init();
				});
			break;
		case "view total budget by department":
			departments = await employeeTracker.getAllDepartments();
			const viewTotalBudgetByDepartmentQuestions = createViewTotalBudgetByDepartmentQuestions(departments);
			inquirer
				.prompt(viewTotalBudgetByDepartmentQuestions)
				.then(manageViewTotalBudgetByDepartment)
				.catch((error) => {
					if (error.isTtyError) {
						console.error("Prompt couldn't be rendered in the current environment");
					} else {
						console.error("Something else went wrong", error);
					}
					init();
				});
			break;
		case "add a department":
			inquirer
				.prompt(addDepartmentQuestions)
				.then(manageAddDepartment)
				.catch((error) => {
					if (error.isTtyError) {
						console.error("Prompt couldn't be rendered in the current environment");
					} else {
						console.error("Something else went wrong");
					}
					init();
				});
			break;
		case "add a role":
			departments = await employeeTracker.getAllDepartments();
			const addRoleQuestions = createAddRoleQuestions(departments);
			inquirer
				.prompt(addRoleQuestions)
				.then(manageAddRole)
				.catch((error) => {
					if (error.isTtyError) {
						console.error("Prompt couldn't be rendered in the current environment");
					} else {
						console.error("Something else went wrong");
					}
					init();
				});
			break;
		case "add an employee":
			roles = await employeeTracker.getAllRoles();
			employees = await employeeTracker.getAllEmployees();
			const addEmployeesQuestions = createAddEmployeeQuestions(roles, employees);
			inquirer
				.prompt(addEmployeesQuestions)
				.then(manageAddEmployees)
				.catch((error) => {
					if (error.isTtyError) {
						console.error("Prompt couldn't be rendered in the current environment");
					} else {
						console.error("Something else went wrong");
					}
					init();
				});
			break;
		case "update an employee role":
			employees = await employeeTracker.getAllEmployees();
			roles = await employeeTracker.getAllRoles();
			const updateEmployeeRoleQuestions = createUpdateEmployeeRoleQuestions(employees, roles);
			inquirer
				.prompt(updateEmployeeRoleQuestions)
				.then(manageUpdateEmployeeRole)
				.catch((error) => {
					if (error.isTtyError) {
						console.error("Prompt couldn't be rendered in the current environment");
					} else {
						console.error("Something else went wrong");
					}
					init();
				});
			break;
		case "update an employee manager":
			employees = await employeeTracker.getAllEmployees();
			const updateEmployeeManagerQuestions = createUpdateEmployeeManagerQuestions(employees);
			inquirer
				.prompt(updateEmployeeManagerQuestions)
				.then(manageUpdateEmployeeManager)
				.catch((error) => {
					if (error.isTtyError) {
						console.error("Prompt couldn't be rendered in the current environment");
					} else {
						console.error("Something else went wrong");
					}
					init();
				});
			break;
		case "delete a department":
			departments = await employeeTracker.getAllDepartments();
			const deleteDepartmentQuestions = createDeleteDepartmentQuestions(departments);
			inquirer
				.prompt(deleteDepartmentQuestions)
				.then(manageDeleteDepartment)
				.catch((error) => {
					if (error.isTtyError) {
						console.error("Prompt couldn't be rendered in the current environment");
					} else {
						console.error("Something else went wrong");
					}
					init();
				});
			break;
		case "delete a role":
			roles = await employeeTracker.getAllRoles();
			const deleteRoleQuestions = createDeleteRoleQuestions(roles);
			inquirer
				.prompt(deleteRoleQuestions)
				.then(manageDeleteRole)
				.catch((error) => {
					if (error.isTtyError) {
						console.error("Prompt couldn't be rendered in the current environment");
					} else {
						console.error("Something else went wrong");
					}
					init();
				});
			break;
		case "delete an employee":
			employees = await employeeTracker.getAllEmployees();
			const deleteEmployeeQuestions = createDeleteEmployeeQuestions(employees);
			inquirer
				.prompt(deleteEmployeeQuestions)
				.then(manageDeleteEmployee)
				.catch((error) => {
					if (error.isTtyError) {
						console.error("Prompt couldn't be rendered in the current environment");
					} else {
						console.error("Something else went wrong", error);
					}
					init();
				});
			break;
	}
}

function init() {
	if (isFirstRun) {
		console.log(`
______                 _                       
|  ____|               | |                      
| |__   _ __ ___  _ __ | | ___  _   _  ___  ___ 
|  __| | '_ \` _ \\| '_ \\| |/ _ \\| | | |/ _ \\/ _ \\
| |____| | | | | | |_) | | (_) | |_| |  __/  __/
|______|_| |_| |_| .__/|_|\\___/ \\__, |\\___|\\___|
		 | |             __/ |          
		 |_|            |___/           		
__  __                                   
|  \\/  |                                  
| \\  / | __ _ _ __   __ _  __ _  ___ _ __ 
| |\\/| |/ _\` | '_ \\ / _\` |/ _\` |/ _ \\ '__|
| |  | | (_| | | | | (_| | (_| |  __/ |   
|_|  |_|\\__,_|_| |_|\\__,_|\\__, |\\___|_|   
			   __/ |          
			  |___/           
	`);
		isFirstRun = false;
	}

	inquirer
		.prompt(mainMenuQuestions)
		.then(manageMainMenu)
		.catch((error) => {
			if (error.isTtyError) {
				console.error("Prompt couldn't be rendered in the current environment");
			} else {
				console.error("Something else went wrong");
			}
			init();
		});
}

init();
