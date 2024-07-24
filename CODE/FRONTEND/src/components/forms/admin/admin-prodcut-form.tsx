import React, { useState, useEffect } from "react";
import { Form, Input, Button, Row, Col } from "antd";
import { FormInstance } from "antd/es/form";
import { Items, RequestItem } from "../../../service/items/types";
import { PostItems, updateItem } from "../../../service/items";
import { useAxios } from "../../../helpers/axios/useAxios";

interface ProductFormProps {
	form: FormInstance;
	onClose: () => void;
	initialValues?: Items | null;
	refreshProducts: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ form, onClose, initialValues, refreshProducts }) => {
	const [product, setProduct] = useState<RequestItem>({
		name: "",
		code: "",
		width: 0,
		height: 0,
		length: 0,
		weight: 0,
	});

	const axios = useAxios();

	useEffect(() => {
		if (initialValues) {
			setProduct(initialValues);
			form.setFieldsValue(initialValues);
		} else {
			form.resetFields();
		}
	}, [initialValues, form]);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setProduct({ ...product, [name]: value });
	};

	const handleSubmit = async () => {
		try {
			await form.validateFields();
			if (initialValues) {
				const succ = await updateItem(initialValues.id, product, axios);
				if (!succ) return;
			} else {
				const succ = await PostItems(product, axios);
				if (!succ) return;
			}
			refreshProducts();
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
						name='name'
						label='Product Name'
						rules={[{ required: true, message: "Please enter product name" }]}
					>
						<Input
							name='name'
							placeholder='Please enter product name'
							value={product.name}
							onChange={handleInputChange}
						/>
					</Form.Item>
				</Col>
				<Col span={12}>
					<Form.Item
						name='code'
						label='Product Code'
						rules={[{ required: true, message: "Please enter product code" }]}
					>
						<Input
							name='code'
							placeholder='Please enter product code'
							value={product.code}
							onChange={handleInputChange}
						/>
					</Form.Item>
				</Col>
				<Col span={12}>
					<Form.Item name='width' label='Width' rules={[{ required: true, message: "Please enter width" }]}>
						<Input
							name='width'
							type='number'
							placeholder='Please enter width'
							value={product.width}
							onChange={handleInputChange}
						/>
					</Form.Item>
				</Col>
				<Col span={12}>
					<Form.Item name='height' label='Height' rules={[{ required: true, message: "Please enter height" }]}>
						<Input
							name='height'
							type='number'
							placeholder='Please enter height'
							value={product.height}
							onChange={handleInputChange}
						/>
					</Form.Item>
				</Col>
				<Col span={12}>
					<Form.Item name='length' label='Length' rules={[{ required: true, message: "Please enter length" }]}>
						<Input
							name='length'
							type='number'
							placeholder='Please enter length'
							value={product.length}
							onChange={handleInputChange}
						/>
					</Form.Item>
				</Col>
				<Col span={12}>
					<Form.Item name='weight' label='Weight' rules={[{ required: true, message: "Please enter weight" }]}>
						<Input
							name='weight'
							type='number'
							placeholder='Please enter weight'
							value={product.weight}
							onChange={handleInputChange}
						/>
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

export default ProductForm;
