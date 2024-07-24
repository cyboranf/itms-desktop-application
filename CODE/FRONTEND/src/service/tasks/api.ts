import { AxiosInstance } from "axios";
import { Paths } from "./path";
import { Task, TaskType, TaskReturn } from "./types";
import { toast } from "react-toastify";

export const getAllTasks = async (axios: AxiosInstance): Promise<{ tasks: TaskReturn[]; totalCount: number }> => {
	const response = await axios.get<TaskReturn[]>(Paths.TASKS);
	const tasks = response.data;
	return {
		tasks: tasks,
		totalCount: tasks.length,
	};
};

export const getAllTasksTypes = async (axios: AxiosInstance): Promise<TaskType[]> => {
	const data = await axios.get<TaskType[]>(Paths.TASK_TYPE);
	return data.data;
};

export const PostTask = async (params: Task, axios: AxiosInstance) => {
	try {
		const task = await axios.post(Paths.TASKS, params);
		return task.data;
	} catch (error) {
		console.error("Błąd podczas aktualizacji zadania:", error);
		return false;
	}
};

export const DeleteTask = async (id: string, axios: AxiosInstance) => {
	const url = Paths.TASKS_ID.replace("{id}", id);
	try {
		await axios.delete(url);
		toast.success("Task deleted successfully");
		return true;
	} catch (error) {
		toast.error("Error while deleting task");
		return false;
	}
};

export const requestTaskReport = async (
	includeUsers: boolean,
	includeProducts: boolean,
	includeWarehouses: boolean,
	includePieChart: boolean,
	taskId: string[],
	userId: string,
	priority: string[],
	state: string[],
	axios: AxiosInstance
) => {
	try {
		const response = await axios.get(Paths.RAPORT, {
			responseType: "blob",
			params: {
				includeUsers,
				includeWarehouses,
				includePieChart,
				includeProducts,
				taskId,
				userId,
				priority,
				state,
			},
		});

		if (response.status === 200) {
			const url = window.URL.createObjectURL(new Blob([response.data]));
			const link = document.createElement("a");
			link.href = url;
			link.setAttribute("download", "task-report.pdf");
			document.body.appendChild(link);
			link.click();
			window.URL.revokeObjectURL(url);
		} else {
			console.error("Błąd podczas pobierania raportu:", response);
		}
	} catch (error) {
		console.error("Błąd sieci:", error);
	}
};

export const PostTaskProduct = async (taskId: number, productId: number, axios: AxiosInstance) => {
	try {
		const url = `http://127.0.0.1:8080/api/tasks/${taskId}/join/products/${productId}`;
		await axios.post(url);
		return true;
	} catch (error) {
		console.error("Błąd podczas PostTaskProduct:", error);
		return false;
	}
};

export const PostTaskUsers = async (userId: number, taskId: number, axios: AxiosInstance) => {
	try {
		const url = `http://127.0.0.1:8080/api/users/${userId}/join/tasks/${taskId}`;
		await axios.post(url);
		return true;
	} catch (error) {
		console.error("Błąd podczas PostTaskProduct:", error);
		return false;
	}
};

export const PostTaskWarhouse = async (taskId: number, warehouseId: number, axios: AxiosInstance) => {
	try {
		const url = `http://127.0.0.1:8080/api/tasks/${taskId}/join/warehouse/${warehouseId}`;
		await axios.post(url);
		return true;
	} catch (error) {
		console.error("Błąd podczas PostTaskProduct:", error);
		return false;
	}
};

export const getAllTasksSelf = async (axios: AxiosInstance): Promise<{ tasks: Task[]; totalCount: number }> => {
	const response = await axios.get<Task[]>(Paths.TASK_SELF);
	const tasks = response.data;
	return {
		tasks: tasks,
		totalCount: tasks.length,
	};
};

export const getAllTasksSelfDashboard = async (
	axios: AxiosInstance
): Promise<{ tasks: TaskReturn[]; totalCount: number }> => {
	const response = await axios.get<TaskReturn[]>(Paths.TASK_SELF);
	const tasks = response.data;
	return {
		tasks: tasks,
		totalCount: tasks.length,
	};
};

export const TaskFinished = async (id: string, axios: AxiosInstance) => {
	console.log(id);
	const url = Paths.TASK_FINISHED.replace("{taskId}", id);
	await axios.post(url);
	return true;
};
