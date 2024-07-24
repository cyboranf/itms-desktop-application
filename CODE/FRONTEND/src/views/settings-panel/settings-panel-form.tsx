import React from "react";
import { useForm } from "react-hook-form";
import { PutUsers } from "../../service/users";
import { useAxios } from "../../helpers/axios/useAxios";
import { toast } from "react-toastify";
import { User } from "../../service/users/types";

type SettingsPanelFormProps = {
	user: User;
	setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

const SettingsPanelForm = ({ user, setUser }: SettingsPanelFormProps) => {
	const axios = useAxios();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {
			username: user.username,
			name: user.name,
			lastname: user.lastname,
			pesel: user.pesel,
			email: user.email,
			phoneNumber: user.phoneNumber,
		},
	});

	const onSubmit = async (data: any) => {
		const newUser = { ...data, id: user.id };

		try {
			const res = await PutUsers(newUser, axios);
			setUser(res.data);
			toast.success("User updated successfully");
		} catch (err: unknown) {
			toast.error("Error updating user");
			console.log(err);
		}
	};

	return (
		<>
			<h3>Edit User Information</h3>
			<form className='form' onSubmit={handleSubmit(onSubmit)}>
				<div>
					<input
						className='input'
						placeholder='Email'
						{...register("email", {
							required: "Email is required",
							pattern: {
								value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
								message: "Invalid email address",
							},
						})}
					/>
					{errors.email && <p>{errors.email.message}</p>}
				</div>
				<div>
					<input
						className='input'
						placeholder='Last Name'
						{...register("lastname", { required: "Last name is required" })}
					/>
					{errors.lastname && <p>{errors.lastname.message}</p>}
				</div>
				<div>
					<input
						className='input'
						placeholder='First Name'
						{...register("name", { required: "First name is required" })}
					/>
					{errors.name && <p>{errors.name.message}</p>}
				</div>
				<div>
					<input
						className='input'
						placeholder='Phone Number'
						{...register("phoneNumber", { required: "Phone number is required" })}
					/>
					{errors.phoneNumber && <p>{errors.phoneNumber.message}</p>}
				</div>
				<div>
					<input
						className='input'
						placeholder='Username'
						{...register("username", { required: "Username is required" })}
					/>
					{errors.username && <p>{errors.username.message}</p>}
				</div>
				<div>
					<input
						className='input'
						placeholder='PESEL'
						{...register("pesel", {
							required: "PESEL is required",
							minLength: { value: 11, message: "PESEL must be 11 characters" },
							maxLength: { value: 11, message: "PESEL must be 11 characters" },
						})}
					/>
					{errors.pesel && <p>{errors.pesel.message}</p>}
				</div>
				<button type='submit' className='button'>
					Update
				</button>
			</form>
		</>
	);
};

export default SettingsPanelForm;
