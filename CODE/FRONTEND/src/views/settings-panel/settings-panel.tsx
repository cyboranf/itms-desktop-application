import "./settings-panel.scss";
import { FaUserCircle } from "react-icons/fa";
import { useEffect, useState } from "react";
import { getSelf } from "../../service/users";
import { useAxios } from "../../helpers/axios/useAxios";
import { User } from "../../service/users/types";
import { toast } from "react-toastify";
import SettingsPanelForm from "./settings-panel-form";

const SettingsPanel = () => {
	const [user, setUser] = useState<User | null>(null);
	const axios = useAxios();

	const getUserData = async () => {
		try {
			const user = await getSelf(axios);
			setUser(user);
		} catch (error: unknown) {
			console.error("Error during getting user data:", error);
			toast.error("Error during getting user data");
		}
	};

	useEffect(() => {
		getUserData();
	}, []);

	return (
		<div className='main-container'>
			<h2 className='main-title'>Settings</h2>
			<div className='grid-container'>

				<div className='section'>
					<h3>User Information</h3>
					<div className='user-info'>
						<FaUserCircle className='user-icon' />
						<div className='user-details'>
							<p>
								<strong>Username:</strong> {user?.username}
							</p>
							<p>
								<strong>Email:</strong> {user?.email}
							</p>
							<p>
								<strong>First Name:</strong> {user?.name}
							</p>
							<p>
								<strong>Last Name:</strong> {user?.lastname}
							</p>
							<p>
								<strong>Phone Number:</strong> {user?.phoneNumber}
							</p>
						</div>
					</div>
				</div>
				<div className='section'>{user && <SettingsPanelForm user={user} setUser={setUser} />}</div>
			</div>
		</div>
	);
};

export default SettingsPanel;
