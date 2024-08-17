const pg = require("pg");

const {Client} = pg;

class EmployeeTracker {
	constructor() {
		this.client = new Client({
			user: "postgres",
			password: "password",
			host: "localhost",
			port: 5432,
			database: "employee_tracker",
		});
		this.client.connect();
	}

	async getAllDepartments() {
		const query = "SELECT * FROM department";
		try {
			const departments = await this.client.query(query);
			return departments.rows;
		} catch (err) {
			console.error("Error retrieving departments: ", err);
		}
	}
	async getAllRoles() {
		const query = "SELECT * FROM role";
		try {
			const roles = await this.client.query(query);
			return roles.rows;
		} catch (err) {
			console.error("Error retrieving roles: ", err);
		}
	}
	async getAllEmployees() {
		const query = "SELECT * FROM employee";
		try {
			const employees = await this.client.query(query);
			return employees.rows;
		} catch (err) {
			console.error("Error retrieving employees: ", err);
		}
	}
	async getAllManagers() {
		const query = "SELECT DISTINCT e.* FROM employee e JOIN employee m ON e.id = m.manager_id ORDER BY e.id";
		try {
			const managers = await this.client.query(query);
			return managers.rows;
		} catch (err) {
			console.error("Error retrieving managers: ", err);
		}
	}
	async getAllManagersEmployees(managerId) {
		const query = "SELECT * FROM employee WHERE manager_id = $1";
		const values = [managerId];
		try {
			const employees = await this.client.query(query, values);
			return employees.rows;
		} catch (err) {
			console.error("Error retrieving employees: ", err);
		}
	}
	async getAllDepartmentsEmployees(departmentId) {
		const query = "SELECT employee.* FROM employee JOIN role ON employee.role_id = role.id WHERE role.department_id = $1";
		const values = [departmentId];
		try {
			const employees = await this.client.query(query, values);
			return employees.rows;
		} catch (err) {
			console.error("Error retrieving employees: ", err);
		}
	}
	async getTotalBudgetByDepartment(departmentId) {
		const query = `
			SELECT SUM(role.salary) AS total_budget
			FROM employee
			JOIN role ON employee.role_id = role.id
			WHERE role.department_id = $1`;
		const values = [departmentId];
		try {
			const budget = await this.client.query(query, values);
			return budget.rows;
		} catch (err) {
			console.error("Error retrieving total budget: ", err);
		}
	}

	async viewAllDepartments(callback) {
		try {
			const departments = await this.getAllDepartments();
			console.log("\n");
			console.table(departments);
			console.log("\n");
		} catch (err) {
			console.error("Error viewing departments:", err);
			callback();
			return;
		}
		callback();
	}
	async viewAllRoles(callback) {
		try {
			const departments = await this.getAllDepartments();
			const roles = await this.getAllRoles();
			const rolesViews = roles.map((role) => {
				const department = departments.find((department) => department.id === role.department_id);
				return {
					id: role.id,
					title: role.title,
					department: department.name,
					salary: role.salary,
				};
			});
			console.log("\n");
			console.table(rolesViews);
			console.log("\n");
		} catch (err) {
			console.error("Error viewing roles:", err);
			callback();
			return;
		}
		callback();
	}
	async viewAllEmployees(callback) {
		try {
			const departments = await this.getAllDepartments();
			const roles = await this.getAllRoles();
			const employees = await this.getAllEmployees();

			const employeesViews = employees.map((employee) => {
				const role = roles.find((role) => role.id === employee.role_id);
				const department = departments.find((department) => department.id === role.department_id);
				const manager = employees.find((e) => e.id === employee.manager_id);

				return {
					id: employee.id,
					first_name: employee.first_name,
					last_name: employee.last_name,
					title: role.title,
					department: department.name,
					salary: role.salary,
					manager: manager ? `${manager.first_name} ${manager.last_name}` : "null",
				};
			});

			console.log("\n");
			console.table(employeesViews);
			console.log("\n");
		} catch (err) {
			console.error("Error viewing employees: ", err);
			callback();
			return;
		}
		callback();
	}
	async viewEmployeesByManager(managerId, callback) {
		try {
			const departments = await this.getAllDepartments();
			const roles = await this.getAllRoles();
			const employees = await this.getAllManagersEmployees(managerId);

			const employeesViews = employees.map((employee) => {
				const role = roles.find((role) => role.id === employee.role_id);
				const department = departments.find((department) => department.id === role.department_id);
				const manager = employees.find((e) => e.id === employee.manager_id);

				return {
					id: employee.id,
					first_name: employee.first_name,
					last_name: employee.last_name,
					title: role.title,
					department: department.name,
					salary: role.salary,
					manager: manager ? `${manager.first_name} ${manager.last_name}` : "null",
				};
			});

			console.log("\n");
			console.table(employeesViews);
			console.log("\n");
		} catch (err) {
			console.error("Error viewing employees by manager: ", err);
			callback();
			return;
		}
		callback();
	}
	async viewEmployeesByDepartment(departmentId, callback) {
		try {
			const departments = await this.getAllDepartments();
			const roles = await this.getAllRoles();
			const employees = await this.getAllDepartmentsEmployees(departmentId);

			const employeesViews = employees.map((employee) => {
				const role = roles.find((role) => role.id === employee.role_id);
				const department = departments.find((department) => department.id === role.department_id);
				const manager = employees.find((e) => e.id === employee.manager_id);

				return {
					id: employee.id,
					first_name: employee.first_name,
					last_name: employee.last_name,
					title: role.title,
					department: department.name,
					salary: role.salary,
					manager: manager ? `${manager.first_name} ${manager.last_name}` : "null",
				};
			});

			console.log("\n");
			console.table(employeesViews);
			console.log("\n");
		} catch (err) {
			console.error("Error viewing employees by department: ", err);
			callback();
			return;
		}
		callback();
	}
	async viewTotalBudgetByDepartment(departmentId, callback) {
		try {
			const budget = await this.getTotalBudgetByDepartment(departmentId);
			console.log("\n");
			console.table(budget);
			console.log("\n");
		} catch (err) {
			console.error("Error viewing total budget by department: ", err);
			callback();
			return;
		}
		callback();
	}

	async addDepartment(name, callback) {
		const query = "INSERT INTO department (name) VALUES ($1)";
		const values = [name];
		try {
			await this.client.query(query, values);
			console.log(`Added ${name} to the database`);
		} catch (err) {
			console.log("Error creating department: ", err);
			callback();
			return;
		}
		callback();
	}
	async addRole(answers, callback) {
		const query = "INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)";
		const values = [answers.title, answers.salary, answers.department_id];
		try {
			await this.client.query(query, values);
			console.log(`Added ${answers.title} to the database`);
		} catch (err) {
			console.log("Error creating role: ", err);
			callback();
			return;
		}
		callback();
	}
	async addEmployee(answers, callback) {
		const query = "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)";
		const values = [answers.first_name, answers.last_name, answers.role_id, answers.manager_id];
		try {
			await this.client.query(query, values);
			console.log(`Added ${answers.first_name} to the database`);
		} catch (err) {
			console.log("Error creating employee: ", err);
			callback();
			return;
		}
		callback();
	}

	async updateEmployeeRole(answers, callback) {
		const query = "UPDATE employee SET role_id = $1 WHERE id = $2";
		const values = [answers.role_id, answers.employee_id];
		try {
			await this.client.query(query, values);
			console.log(`Updated employee's role in the database`);
		} catch (err) {
			console.error("Error updating employee's role: ", err);
			callback();
			return;
		}
		callback();
	}
	async updateEmployeeManager(answers, callback) {
		const query = "UPDATE employee SET manager_id = $1 WHERE id = $2";
		const values = [answers.manager_id, answers.employee_id];
		try {
			await this.client.query(query, values);
			console.log(`Updated employee's manager in the database`);
		} catch (err) {
			console.error("Error updating employee's manager: ", err);
			callback();
			return;
		}
		callback();
	}

	async deleteDepartment(departmentId, callback) {
		const query = "DELETE FROM department WHERE id = $1";
		const values = [departmentId];
		try {
			await this.client.query(query, values);
			console.log(`Deleted department from the database`);
		} catch (err) {
			if (err.code === "23503") {
				console.log("You cannot delete this because another element depends on it");
				callback();
				return;
			}
			console.error("Error deleting department: ", err);
			callback();
			return;
		}
		callback();
	}
	async deleteRole(roleId, callback) {
		const query = "DELETE FROM role WHERE id = $1";
		const values = [roleId];
		try {
			await this.client.query(query, values);
			console.log(`Deleted role from the database`);
		} catch (err) {
			if (err.code === "23503") {
				console.log("You cannot delete this because another element depends on it");
				callback();
				return;
			}
			console.error("Error deleting role: ", err);
			callback();
			return;
		}
		callback();
	}
	async deleteEmployee(employeeId, callback) {
		const query = "DELETE FROM employee WHERE id = $1";
		const values = [employeeId];
		try {
			await this.client.query(query, values);
			console.log(`Deleted employee from the database`);
		} catch (err) {
			if (err.code === "23503") {
				console.log("You cannot delete this because another element depends on it");
				callback();
				return;
			}
			console.error("Error deleting employee: ", err);
			callback();
			return;
		}
		callback();
	}
}

module.exports = {EmployeeTracker};