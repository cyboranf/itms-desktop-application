import { HTMLInputTypeAttribute } from "react";
import { FieldErrorsImpl, UseFormRegisterReturn, get } from "react-hook-form";
import "./input.scss";

type InputProps = {
	type?: HTMLInputTypeAttribute;
	register?: UseFormRegisterReturn<string>;
	error?: Partial<FieldErrorsImpl>;
	children?: React.ReactNode;
	placeholder?: string;
	defaultValue?: any;
};

const Input: React.FC<InputProps> = ({
	type = "text",
	register,
	error,
	children,
	placeholder,
	defaultValue,
	...restProps
}) => {
	return (
		<div className='input-wrapper'>
			<label htmlFor={register?.name}>
				<div className='input-wrapper__container'>
					<input
						className='input-wrapper__container__input'
						type={type}
						{...register}
						{...restProps}
						placeholder={placeholder || ""}
						id={register?.name}
						defaultValue={defaultValue}
					/>
				</div>
			</label>
			<div className='input-wrapper__error'>
				<span>{get(error, register?.name || "")?.message?.toString()}</span>
			</div>
		</div>
	);
};

export default Input;
