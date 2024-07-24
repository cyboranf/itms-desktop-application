export type Warehouse = {
	id: number;
	building: string;
	zone: string;
	spaceId: number;
	spaceHeight: number;
	spaceWidth: number;
	spaceLength: number;
	productId: number;
	productName: string;
	productCode: string;
};

export interface RequestWarehouse {
	id?: number; // Making id optional
	building: string;
	zone: string;
	spaceId: number;
	spaceHeight: number;
	spaceWidth: number;
	spaceLength: number;
	productId: number;
	productName: string;
	productCode: string;
}
