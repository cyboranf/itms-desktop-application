import { useState } from "react";
import { useNavigate } from "react-router-dom";
import humanLogo from "../../assets/human-logo.webp";
import logo from "../../assets/logo.webp";
import SignUpForm from "../sign-up-forms/sign-up-form";
import { useForm } from "react-hook-form";
import { RegisterValuesTypes } from "../../service/auth/types";
import { registerUser } from "../../service/auth";
import SignUpForm2 from "../sign-up-forms/sign-up-form2";
import { toast } from "react-toastify";

const SignUp = () => {
	const [currentStep, setCurrentStep] = useState(0);
	const navigate = useNavigate();

	const {
		register,
		handleSubmit,
		watch,
		setValue,
		control,
		trigger,
		formState: { errors, isSubmitted },
	} = useForm<RegisterValuesTypes>({ mode: "all", criteriaMode: "all" });

	const onSubmit = async ({
		username,
		password,
		email,
		role,
		confirm_password,
		first_name,
		last_name,
		pesel,
		phone_number,
	}: RegisterValuesTypes) => {
		try {
			const res = await registerUser({
				username,
				password,
				email,
				role,
				confirm_password,
				first_name,
				last_name,
				pesel,
				phone_number,
			});
			console.log(res);
			navigate("/login");
		} catch (err: unknown) {
			console.log(err);
			toast.error("Błąd przy towrzeniu urzytkownika: " + err);
		}
	};

	const passwordValue = watch("password");

	return (
		<div className='signin-container'>
			<div className='signin-logo'>
				<img src={humanLogo} alt='Human Logo' />
			</div>
			{currentStep === 0 && (
				<SignUpForm
					register={register}
					setCurrentStep={setCurrentStep}
					setValue={setValue}
					passwordValue={passwordValue}
					errors={errors}
					trigger={trigger}
					control={control}
					watch={watch}
					isSubmitted={isSubmitted}
				/>
			)}
			{currentStep === 1 && (
				<SignUpForm2
					register={register}
					setCurrentStep={setCurrentStep}
					errors={errors}
					handleSubmit={handleSubmit}
					onSubmit={onSubmit}
				/>
			)}
			<div className='signin-footer'>
				<img src={logo} alt='Logo' className='footer-logo' />
			</div>
		</div>
	);
};

export default SignUp;
