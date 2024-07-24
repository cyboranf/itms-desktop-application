import { useContext } from "react";
import axios from "axios";
import { DataContext } from "../../context/data-context";

export const useAxios = () => {
	const { currentUser } = useContext(DataContext);

	const instance = axios.create({
		headers: {
			"Content-type": "application/json",
			Accept: "application/json",
		},
		baseURL: "http://localhost:8080/api",
		withCredentials: true,
	});

	instance.interceptors.request.use(
		(config) => {
			if (currentUser) {
				config.headers.Authorization = `Bearer ${currentUser.accessToken}`;
			}
			return config;
		},
		(error) => {
			return Promise.reject(error);
		}
	);

	return instance;
};
