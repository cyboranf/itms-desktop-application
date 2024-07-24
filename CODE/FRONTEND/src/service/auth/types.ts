export type LoginValuesType = {
	username: string;
	password: string;
};

type Rank = {
	authority: string;
};

export type UserData = {
	userName: string;
	accessToken: string;
	rank: Rank[];
	id: number;
};

export type RegisterValuesTypes = {
	username: string;
	email: string;
	password: string;
	confirm_password: string;
	role: string;
	first_name: string;
	last_name: string;
	pesel: string;
	phone_number: string;
};
