import { useContext } from "react";
import { CurrentUser, DataContext, ROLES } from "../../context/data-context";
import { loginUser } from "../../service/auth/api";
import "./example-component.scss";

export const ExampleComponent = () => {
	const { currentUser, setCurrentUser } = useContext(DataContext);

	const loginTest = async () => {
		try {
			const res = await loginUser({ username: "TestTest", password: "TestTest1!" });
			console.log(res);
			console.log(res.rank);

			const rolesArray = Object.values(ROLES) as string[];

			const userRoles = res.rank.map((rank) => rank.authority).filter((authority) => rolesArray.includes(authority));

			let userRole = ROLES.PRINTER as ROLES; // default to lowest role

			for (const role of rolesArray) {
				if (userRoles.includes(role)) {
					userRole = role as ROLES;
					break;
				}
			}

			const user: CurrentUser = {
				userName: res.userName,
				accessToken: res.accessToken,
				role: userRole,
				id: 0
			};

			setCurrentUser(user);
		} catch (err: unknown) {
			console.log(err);
		}
	};

	return (
		<div className='example-component'>
			<div className='example-component__sub'>malowane jajca test</div>
			<button onClick={loginTest}>big login test</button>
			<button onClick={() => console.log(currentUser)}>show current user</button>
		</div>
	);
};
