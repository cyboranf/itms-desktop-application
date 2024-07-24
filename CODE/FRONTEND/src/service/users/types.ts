
export type TaskValuesType = {
	id: string,
	name: string,
};

export type Role = {
	id: number;
	name: string;
};

export type User = {
	id: number;
	username: string;
	name: string;
	lastname: string;
	pesel: string;
	email: string;
	phoneNumber: string;
	roles: string;
};

export type UserWithoutTasks = {
	id: number;
	username: string;
	name: string;
	lastname: string;
	pesel: string;
	email: string;
	phoneNumber: string;
};

