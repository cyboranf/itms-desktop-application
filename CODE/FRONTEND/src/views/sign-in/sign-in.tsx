import { useState, useContext } from "react";
import "./sign-in.scss";
import humanLogo from "../../assets/human-logo.webp";
import logo from "../../assets/logo.webp";
import { useForm } from "react-hook-form";
import Input from "../../components/input/input";
import { loginUser } from "../../service/auth";
import { RegexpValidators } from "../../utils/reg-exp";
import { useNavigate, Link } from "react-router-dom";
import { CurrentUser, DataContext, ROLES } from "../../context/data-context";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";

export type LoginValuesType = {
	username: string;
	password: string;
};

export const SignIn = () => {
	const navigate = useNavigate();
	const { setCurrentUser } = useContext(DataContext);
	const [showPassword, setShowPassword] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginValuesType>();

	const onSubmit = async ({ username, password }: LoginValuesType) => {
		try {
			const res = await loginUser({ username, password });
			console.log(res);
			console.log(res.rank);

			const rolesArray = Object.values(ROLES) as string[];

			const userRoles = res.rank.map((rank) => rank.authority).filter((authority) => rolesArray.includes(authority));

			let userRole = ROLES.PRINTER as ROLES;

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
				id: res.id,
			};

			setCurrentUser(user);

			toast.success("Logged in successfully");
			switch (userRole) {
				case ROLES.WAREHOUSEMAN:
					navigate("/warehouseman/home");
					break;
				case ROLES.PRINTER:
					navigate("/printer/home");
					break;
				case ROLES.MANAGER:
					navigate("/manager/home");
					break;
				case ROLES.ADMIN:
					navigate("/home");
					break;
				case ROLES.USER:
					navigate("/waiting");
					break;
				default:
					navigate("/");
					break;
			}
		} catch (err: unknown) {
			toast.error("Wrong username or password");
			console.log(err);
		}
	};

	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword);
	};

	return (
		<div className='signin-container'>
			<div className='signin-logo'>
				<img src={humanLogo} alt='Human Logo' />
			</div>
			<div className='signin-form-container'>
				<div className='signin-form'>
					<h1>Sign in</h1>
					<p className='welcome-back'>Welcome back!</p>
					<form onSubmit={handleSubmit(onSubmit)}>
						<div className='input-container'>
							<Input
								placeholder='Username'
								register={register("username", {
									minLength: 3,
									maxLength: 18,
									pattern: {
										value: RegexpValidators.USERNAME_LETTERS_ONLY,
										message: "Use only letters",
									},
									required: "Required",
								})}
								error={errors}
							/>
						</div>

						<div className='input-container password-input-container'>
							<Input
								placeholder='Password'
								type={showPassword ? "text" : "password"}
								register={register("password", {
									minLength: 5,
									maxLength: 50,
									required: "Required",
								})}
								error={errors}
							/>
							<button type='button' className='password-toggle-button' onClick={togglePasswordVisibility}>
								{showPassword ? <FaEyeSlash /> : <FaEye />}
							</button>
						</div>

						<div className='forgot-password'>
							<a href='#'>Forgot password?</a>
						</div>
						<button type='submit' className='signin-button'>
							Sign in
						</button>
					</form>
					<div className='signup-link'>
						<Link to='/register'>New to ITMS? Create an account</Link>
					</div>
				</div>
			</div>
			<div className='signin-footer'>
				<img src={logo} alt='Logo' className='footer-logo' />
			</div>
		</div>
	);
};

export default SignIn;
