import React, { useState, useEffect } from "react";
import { Form, Input, Button, Row, Col, Select } from "antd";
import { FormInstance } from "antd/es/form";
import { Warehouse, RequestWarehouse } from "../../../service/warehouses/types";
import { getAllItems } from "../../../service/items";
import { Items } from "../../../service/items/types";
import { useAxios } from "../../../helpers/axios/useAxios";
import { PostWarehouse, updateWarehouse } from "../../../service/warehouses";

const { Option } = Select;

interface CreateWarehouseFormProps {
	form: FormInstance;
	onClose: () => void;
	initialValues?: Warehouse | null;
	refreshWarehouses: () => void;
	refreshWarehouse: () => void;
}

const WarehouseForm: React.FC<CreateWarehouseFormProps> = ({
	form,
	onClose,
	initialValues,
	refreshWarehouses,
	refreshWarehouse,
}) => {
	const [warehouse, setWarehouse] = useState<RequestWarehouse>({
		building: "",
		zone: "",
		spaceId: 0,
		spaceHeight: 0,
		spaceWidth: 0,
		spaceLength: 0,
		productId: 0,
		productCode: "",
		productName: "",
	});
	const [products, setProducts] = useState<Items[]>([]);

	const axios = useAxios();

	const GetItems = async () => {
		try {
			const res = await getAllItems(axios);
			setProducts(res.items);
		} catch (error) {
			console.error("Error fetching items:", error);
		}
	};

	useEffect(() => {
		GetItems();

		return () => {
			refreshWarehouse();
		};
	}, []);

	useEffect(() => {
		if (initialValues) {
			const selectedProduct = products.find((product) => product.id === initialValues.productId);
			if (selectedProduct) {
				setWarehouse({
					...initialValues,
					productCode: selectedProduct.code,
					productName: selectedProduct.name,
				});
			}
			form.setFieldsValue({
				...initialValues,
				productId: initialValues.productId,
			});
		} else {
			form.resetFields();
		}
	}, [initialValues, form, products]);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setWarehouse({ ...warehouse, [name]: value });
	};

	const handleProductChange = (value: number) => {
		const selectedProduct = products.find((product) => product.id === value);
		if (selectedProduct) {
			setWarehouse({
				...warehouse,
				productId: selectedProduct.id,
				productCode: selectedProduct.code,
				productName: selectedProduct.name,
			});
			form.setFieldsValue({ productId: value });
		}
	};

	const handleSubmit = async () => {
		try {
			await form.validateFields();
			if (initialValues) {
				const succ = await updateWarehouse(initialValues.id, warehouse, axios);
				if (!succ) return;
			} else {
				const succ = await PostWarehouse(warehouse, axios);
				if (!succ) return;
			}
			refreshWarehouses();
			onClose();
		} catch (err) {
			console.error("Error during form submission:", err);
		}
	};

	return (
		<Form layout='vertical' hideRequiredMark form={form}>
			<Row gutter={16}>
				<Col span={12}>
					<Form.Item
						name='building'
						label='Building Name'
						rules={[{ required: true, message: "Please enter building name" }]}
					>
						<Input
							name='building'
							placeholder='Please enter building name'
							value={warehouse.building}
							onChange={handleInputChange}
						/>
					</Form.Item>
				</Col>
				<Col span={12}>
					<Form.Item name='zone' label='Zone Name' rules={[{ required: true, message: "Please enter zone name" }]}>
						<Input
							name='zone'
							placeholder='Please enter zone name'
							value={warehouse.zone}
							onChange={handleInputChange}
						/>
					</Form.Item>
				</Col>
				<Col span={12}>
					<Form.Item name='spaceId' label='Space Id' rules={[{ required: true, message: "Please enter space Id" }]}>
						<Input
							name='spaceId'
							placeholder='Please enter space Id'
							value={warehouse.spaceId}
							onChange={handleInputChange}
							type="number"
						/>
					</Form.Item>
				</Col>
				<Col span={12}>
					<Form.Item
						name='spaceHeight'
						label='Space Height'
						rules={[{ required: true, message: "Please enter space height" }]}
					>
						<Input
							name='spaceHeight'
							type='number'
							placeholder='Please enter space height'
							value={warehouse.spaceHeight}
							onChange={handleInputChange}
						/>
					</Form.Item>
				</Col>
				<Col span={12}>
					<Form.Item
						name='spaceWidth'
						label='Space Width'
						rules={[{ required: true, message: "Please enter space width" }]}
					>
						<Input
							name='spaceWidth'
							type='number'
							placeholder='Please enter space width'
							value={warehouse.spaceWidth}
							onChange={handleInputChange}
						/>
					</Form.Item>
				</Col>
				<Col span={12}>
					<Form.Item
						name='spaceLength'
						label='Space Length'
						rules={[{ required: true, message: "Please enter space length" }]}
					>
						<Input
							name='spaceLength'
							type='number'
							placeholder='Please enter space length'
							value={warehouse.spaceLength}
							onChange={handleInputChange}
						/>
					</Form.Item>
				</Col>
				<Col span={12}>
					<Form.Item name='productId' label='Product' rules={[{ required: true, message: "Please select a product" }]}>
						<Select placeholder='Please select a product' value={warehouse.productId} onChange={handleProductChange}>
							{products.map((product) => (
								<Option key={product.id} value={product.id}>
									{product.name}
								</Option>
							))}
						</Select>
					</Form.Item>
				</Col>
				<Col span={24}>
					<Form.Item>
						<Button type='primary' onClick={handleSubmit} block>
							Submit
						</Button>
					</Form.Item>
				</Col>
			</Row>
		</Form>
	);
};

export default WarehouseForm;
