import { AxiosInstance } from "axios";
import { toast } from "react-toastify";
import { Paths } from "./path";
import { Warehouse, RequestWarehouse } from "./types";

// Function to get all warehouses
export const getAllWarehouses = async (axios: AxiosInstance): Promise<Warehouse[]> => {
	try {
		const data = await axios.get<Warehouse[]>(Paths.WAREHOUSE);
		return data.data;
	} catch (error) {
		console.error("Error fetching warehouses:", error);
		toast.error("Failed to fetch warehouses");
		return [];
	}
};

// Function to post a new warehouse
export const PostWarehouse = async (params: RequestWarehouse, axios: AxiosInstance) => {
	try {
		await axios.post(Paths.WAREHOUSE, params);
		toast.success("New warehouse added");
		return true;
	} catch (error) {
		console.error("Error adding new warehouse:", error);
		toast.error("Failed to add new warehouse");
		return false;
	}
};

// Function to update an existing warehouse
export const updateWarehouse = async (id: number, params: RequestWarehouse, axios: AxiosInstance) => {
	try {
		await axios.put(`${Paths.WAREHOUSE}/${id}`, params);
		toast.success("Warehouse updated");
		return true;
	} catch (error) {
		console.error("Error updating warehouse:", error);
		toast.error("Failed to update warehouse");
		return false;
	}
};

export const deleteWarehouse = async (id: number, axios: AxiosInstance) => {
	try {
		await axios.delete(`${Paths.WAREHOUSE}/${id}`);
		toast.success("Warehouse deleted");
		return true;
	} catch (error) {
		console.error("Error deleting warehouse:", error);
		toast.error("Failed to delete warehouse");
		return false;
	}
};

// Function to request a warehouse report
export const requestWarehouseReport = async (
	building: string[],
	zone: string[],
	spaceId: string[],
	axios: AxiosInstance
) => {
	try {
		const response = await axios.get(Paths.RAPORT, {
			responseType: "blob",
			params: {
				building,
				zone,
				spaceId,
			},
		});

		if (response.status === 200) {
			const url = window.URL.createObjectURL(new Blob([response.data]));
			const link = document.createElement("a");
			link.href = url;
			link.setAttribute("download", "warehouse-report.pdf");
			document.body.appendChild(link);
			link.click();
			window.URL.revokeObjectURL(url);
		} else {
			console.error("Error downloading report:", response);
		}
	} catch (error) {
		console.error("Network error:", error);
		toast.error("Failed to download warehouse report");
	}
};
