import "./sign-up-form.scss";
import { FieldErrors, UseFormHandleSubmit, UseFormRegister } from "react-hook-form";
import { RegisterValuesTypes } from "../../service/auth/types";
import { SetStateAction } from "react";
import { RegexpValidators } from "../../utils/reg-exp";
import Input from "../../components/input/input";

type SignUpForm2Props = {
	register: UseFormRegister<RegisterValuesTypes>;
	errors: FieldErrors<RegisterValuesTypes>;
	setCurrentStep: React.Dispatch<SetStateAction<number>>;
	onSubmit: (values: RegisterValuesTypes) => Promise<void>;
	handleSubmit: UseFormHandleSubmit<RegisterValuesTypes>;
};

export const SignUpForm2: React.FC<SignUpForm2Props> = ({
	register,
	errors,
	setCurrentStep,
	handleSubmit,
	onSubmit,
}) => {
	return (
		<div className='signin-form-container'>
			<div className='signin-form'>
				<h1>Create account</h1>
				<form onSubmit={handleSubmit(onSubmit)}>
					<Input
						placeholder='First name'
						register={register("first_name", {
							minLength: {
								value: 3,
								message: "First name must be at least 3 characters long",
							},
							maxLength: {
								value: 18,
								message: "First name must be no more than 18 characters long",
							},
							required: "Required",
						})}
						error={errors}
					/>
					<Input
						placeholder='Last name'
						register={register("last_name", {
							minLength: {
								value: 3,
								message: "Last name must be at least 3 characters long",
							},
							maxLength: {
								value: 18,
								message: "Last name must be no more than 18 characters long",
							},
							required: "Required",
						})}
						error={errors}
					/>

					<Input
						placeholder='Pesel'
						register={register("pesel", {
							pattern: {
								value: RegexpValidators.PESEL,
								message: "Pesel must be 11 digits long",
							},
							required: "Required",
						})}
						error={errors}
					/>

					<Input
						placeholder='Tel. Number'
						register={register("phone_number", {
							pattern: {
								value: RegexpValidators.PHONE_NUMBER,
								message: "Tel. Number must be 9 digits long",
							},
							required: "Required",
						})}
						error={errors}
					/>

					<div className='form-field form-field-break'></div>
					<button onClick={() => setCurrentStep(0)}>Back</button>
					<div className='form-field form-field-break'></div>
					<button type='submit'>Create</button>
					<div className='form-progress'>2/2</div>
				</form>
			</div>
		</div>
	);
};

export default SignUpForm2;