// import { UserWithoutTasks } from "../users/types";

export type Task = {
	users: any;
	id: number;
	name: string;
	description: string;
	priority: number;
	startDate: string;
	endDate: string;
	creationDate: string;
	type_id: number;
	state: number;
}

export type TaskReturn = {
	id: number;
	name: string;
	description: string;
	state: number;
	priority: number;
	type: string;
	creationDate: string;
	startDate: string;
	endDate: string;
	users: any[];
	products: any[];
	warehouses: any[];
	isActive: boolean;
}
export type TaskType = {
	id: number;
	name: string;	
}

export type TaskProduct = {
	taskId: number;
	productId: number;	
}

export type TaskUser = {
	userId: number;
	taskId: number;	
}

//TODO jak bedzie isntial warehouse i producst zdefiniowane to zaktualizowac
