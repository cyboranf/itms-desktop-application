import { AxiosInstance } from "axios";
import { Paths } from "./path";
import { TaskValuesType, User, Role } from "./types";
import { toast } from "react-toastify";
import {Task} from '../tasks/types';

export async function GetTasks(axios: AxiosInstance): Promise<TaskValuesType[]> {
	const response = await axios.get(Paths.TASK_TYPE);
	return response.data;
}

export async function DeleteTasks(id: string, axios: AxiosInstance) {
	await axios.delete(Paths.TASK_TYPE_ID.replace("{id}", id.toString()));
	return true;
}

export async function PostTask(params: TaskValuesType, axios: AxiosInstance) {
	try {
		await axios.post(Paths.TASK_TYPE, params);
		return true;
	} catch (error) {
		console.error("Błąd podczas aktualizacji zadania:", error);
		return false;
	}
}

export async function PutTask(params: TaskValuesType, axios: AxiosInstance) {
	try {
		await axios.put(Paths.TASK_TYPE_ID.replace("{id}", params.id.toString()), params);
		return true;
	} catch (error) {
		console.error("Błąd podczas aktualizacji zadania:", error);
		return false;
	}
}

export const getAllUsers = async (axios: AxiosInstance): Promise<{ users: User[]; totalCount: number }> => {
	try {
		const response = await axios.get<User[]>(Paths.ALL_USERS);
		const users = response.data;
		return {
			users: users,
			totalCount: users.length,
		};
	} catch (error) {
		console.error("Błąd podczas pobierania użytkowników:", error);
		toast.error("Błąd podczas pobierania użytkowników");
		return { users: [], totalCount: 0 };
	}
};

export async function PutUsers(params: User, axios: AxiosInstance): Promise<{ data: User }> {
	const res = await axios.put(Paths.USERS_EDIT.replace("{id}", params.id.toString()), params);
	return res.data;
}

export async function DeleteUsers(id: number, axios: AxiosInstance) {
	try {
		await axios.delete(Paths.USERS_ID.replace("{id}", id.toString()));
		toast.success("Usunięto użytkownika");
		return true;
	} catch (error) {
		console.error("Błąd podczas usuwania użytkownika:", error);
		toast.error("Błąd podczas usuwania użytkownika");
		return false;
	}
}

export const requestUsersReport = async (
	includeTasks: boolean,
	username: string[],
	email: string[],
	phoneNumber: string[],
	axios: AxiosInstance
) => {
	try {
		const response = await axios.get(Paths.RAPORT, {
			responseType: "blob",
			params: {
				includeTasks,
				username,
				email,
				phoneNumber,
			},
		});

		if (response.status === 200) {
			const url = window.URL.createObjectURL(new Blob([response.data]));
			const link = document.createElement("a");
			link.href = url;
			link.setAttribute("download", "user-report.pdf");
			document.body.appendChild(link);
			link.click();
			window.URL.revokeObjectURL(url);
		} else {
			console.error("Błąd podczas pobierania raportu:", response);
			toast.error("Błąd podczas pobierania raportu");
		}
	} catch (error) {
		console.error("Błąd sieci:", error);
		toast.error("Błąd sieci");
	}
};

export const getSelf = async (axios: AxiosInstance): Promise<User> => {
	try {
		const response = await axios.get<User>(Paths.SELF);

		return response.data;
	} catch (error) {
		console.error("Błąd podczas pobierania użytkowników:", error);
		toast.error("Błąd podczas pobierania użytkowników");
		throw error;
	}
};

export const updateUserRole = async (userId: number, roleId: number, axios: AxiosInstance): Promise<boolean> => {
	try {
		const response = await axios.put(Paths.ROLES.replace("{id}", userId.toString()), null, {
			params: { role: roleId },
		});
		if (response.status === 200) {
			toast.success("Zaktualizowano rolę użytkownika");
			return true;
		} else {
			toast.error("Błąd podczas aktualizacji roli użytkownika");
			return false;
		}
	} catch (error) {
		console.error("Błąd podczas aktualizacji roli użytkownika:", error);
		toast.error("Błąd podczas aktualizacji roli użytkownika");
		return false;
	}
};

export const getRoles = async (axios: AxiosInstance): Promise<Role[]> => {
	try {
		const response = await axios.get<Role[]>(Paths.ROLES);

		return response.data;
	} catch (error) {
		console.error("Błąd podczas pobierania roli:", error);
		toast.error("Błąd podczas pobierania roli");
		throw error;
	}
};

export const putRoles = async (id: number, role: string,axios: AxiosInstance): Promise<Role[]> => {
	try {
		const response = await axios.put<Role[]>(Paths.USER_ROLE.replace("{userId}", id.toString()), null,{
			params: {
				role
			}
		});

		return response.data;
	} catch (error) {
		console.error("Błąd podczas zmieniania roli:", error);
		toast.error("Błąd podczas zmieniania roli: " + `${error}`);
		throw error;
	}
};
export const getTasks = async (axios: AxiosInstance, id: string): Promise<Task[]> => {
	try {
		const response = await axios.get<Task[]>(Paths.USERS_TASK.replace("{id}", id.toString()));

		return response.data;
	} catch (error) {
		console.error("Błąd podczas pobierania tasków:", error);
		toast.error("Błąd podczas pobierania roli");
		throw error;
	}
}

export const getUsersWithUserRole = async (axios: AxiosInstance): Promise<User[]> => {
	try {
	  const response = await axios.get<User[]>(Paths.USER_WITH_USER_ROLE);
	  return response.data;
	} catch (error) {
	  console.error("Błąd podczas pobierania użytkowników z rolą 'user':", error);
	  toast.error("Błąd podczas pobierania użytkowników z rolą 'user'");
	  throw error;
	}
  };
