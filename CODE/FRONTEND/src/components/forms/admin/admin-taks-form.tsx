import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Select, DatePicker, Row, Col, } from 'antd';
import { FormInstance } from 'antd/es/form';
import { getAllUsers, getSelf } from '../../../service/users';
import { getAllWarehouses } from '../../../service/warehouses';
import { getAllItems } from '../../../service/items';
import { getAllTasksTypes, PostTaskUsers, PostTask, PostTaskWarhouse, PostTaskProduct } from '../../../service/tasks';
import { useAxios } from "../../../helpers/axios/useAxios";
import { toast } from "react-toastify";

const { Option } = Select;

interface TaskFormProps {
	form: FormInstance;
	onClose: () => void;
	handleCreateTask: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ form, onClose }) => {

	const axios = useAxios();

	const [users, setUsers] = useState<{ id: number; name: string, roles: string }[]>([]);
	const [warehouses, setWarhouse] = useState<{ id: number; building: string }[]>([]);
	const [product, setProduct] = useState<{ id: number, name: string }[]>([]);
	const [tasksTypes, setTasksTypes] = useState<{ id: number, name: string }[]>([]);
	const [selectedTaskType, setSelectedTaskType] = useState<number | null>(null);

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const response = await getAllUsers(axios);
				const allUsers = response.users.map((user: any) => ({
					id: user.id,
					name: `${user.name} ${user.lastname} - ${user.roles}`,
					roles: user.roles,
				}));
				setUsers(allUsers);
			} catch (error) {
				console.error('Błąd podczas pobierania użytkowników:', error);
			}
		};

		const fetchedWarhouse = async () => {
			try {
				const response = await getAllWarehouses(axios);

				setWarhouse(response.map(warehouse => ({
					id: warehouse.id,
					building: `${warehouse.building} - ${warehouse.zone} `
				})));

			} catch (error) {
				console.error('Błąd podczas pobierania użytkowników:', error);
			}
		};

		const fetchedProduct = async () => {
			try {
				const response = await getAllItems(axios);

				setProduct(response.items.map(products => ({
					id: products.id,
					name: products.name
				})));

			} catch (error) {
				console.error('Błąd podczas pobierania użytkowników:', error);
			}
		};

		const fetchedTaskTypes = async () => {
			try {
				const response = await getAllTasksTypes(axios);

				setTasksTypes(response.map(products => ({
					id: products.id,
					name: products.name
				})));

			} catch (error) {
				console.error('Błąd podczas pobierania użytkowników:', error);
			}
		};
		fetchedTaskTypes();
		fetchedProduct();
		fetchUsers();
		fetchedWarhouse();
	}, []);

	const onFinish = async (values: any) => {
		const taskParams = {
			users: values.assignee, // assuming `users` field takes an array of user IDs
			id: 0, // Assuming ID is auto-generated
			name: values.name,
			description: values.description,
			state: 1,
			priority: values.priority,
			startDate: values.startDate.format('YYYY-MM-DDTHH:mm:ss'),
			endDate: values.endDate.format('YYYY-MM-DDTHH:mm:ss'),
			type_id: values.taskType,
			creationDate: "",
		};


		try {
			const self = await getSelf(axios);
			const taskCreated = await PostTask(taskParams, axios);
			if (taskCreated) {
				// 1 - Import admin -> warehouseman -> admin
				if (selectedTaskType === 1 || selectedTaskType === 2) {
					PostTaskUsers(self.id, taskCreated.id, axios); // admin
					PostTaskUsers(values.Warehouseman, taskCreated.id, axios); // dodanie warehouseman
					PostTaskWarhouse(taskCreated.id, values.warehouse, axios);
					PostTaskProduct(taskCreated.id, values.product, axios);
				}
				if (selectedTaskType === 3) {
					PostTaskUsers(self.id, taskCreated.id, axios); // admin
					PostTaskUsers(values.Warehouseman, taskCreated.id, axios); // dodanie warehouseman
					PostTaskWarhouse(taskCreated.id, values.warehouse, axios);
					PostTaskWarhouse(taskCreated.id, values.warehouse1, axios);
					PostTaskProduct(taskCreated.id, values.product, axios);

				}
				if (selectedTaskType === 4) {
					PostTaskUsers(self.id, taskCreated.id, axios); // admin
					PostTaskUsers(values.Warehouseman, taskCreated.id, axios); // dodanie warehouseman
					PostTaskUsers(values.printer, taskCreated.id, axios);
				}
				if (selectedTaskType === 5 || selectedTaskType === 6) {
					PostTaskUsers(self.id, values.admin, axios); // admin
					
				}
				toast.success("Stworzona tasks");
				onClose();
			} else {
				toast.error("Bład przy tworzeniu taska")
			}
		} catch (error) {
			console.error('Error while creating task');
		}
	};

	const handleTaskTypeChange = (value: number) => {
		setSelectedTaskType(value);
	};

	const filteredUsersWarehouseman = users.filter(user => user.roles.includes('Warehouseman'));
	const filteredUsersPrinter = users.filter(user => user.roles.includes('Printer'));
	const filteredUsersAdmin = users.filter(user => user.roles.includes('Admin'));
	return (
		<Form layout='vertical' hideRequiredMark form={form} onFinish={onFinish}>
			<Form.Item label="Task Type" name="taskType" rules={[{ required: true, message: 'Please select a task type' }]}>
				<Select
					showSearch
					placeholder="Select a task type"
					onChange={handleTaskTypeChange}
					optionFilterProp="children"
					filterOption={(input, option) =>
						(option?.children as unknown as string).toLowerCase().includes(input.toLowerCase())
					}
				>
					{tasksTypes.map(taskType => (
						<Option key={taskType.id} value={taskType.id}>
							{taskType.name}
						</Option>
					))}
				</Select>
			</Form.Item>
			<Form.Item label="Task Name" name="name" rules={[{ required: true, message: 'Please enter the task name' }]}>
				<Input placeholder="Enter task name" />
			</Form.Item>
			<Form.Item label="Priority" name="priority" rules={[{ required: true, message: 'Please select the priority' }]}>
				<Select placeholder="Select priority">
					<Option value={1}>Low</Option>
					<Option value={2}>Medium</Option>
					<Option value={3}>High</Option>
				</Select>
			</Form.Item>
			<Form.Item label="Description" name="description" rules={[{ required: true, message: 'Please enter the task description' }]}>
				<Input placeholder="Enter task description" />
			</Form.Item>
			<Row gutter={16}>
				<Col span={12}>
					<Form.Item label="Creation Date" name="startDate" rules={[{ required: true, message: 'Please select the creation date' }]}>
						<DatePicker style={{ width: '100%' }} />
					</Form.Item>
				</Col>
				<Col span={12}>
					<Form.Item label="End Date" name="endDate" rules={[{ required: true, message: 'Please select the end date' }]}>
						<DatePicker style={{ width: '100%' }} />
					</Form.Item>
				</Col>
			</Row>
			{selectedTaskType === 1 && (
				<>
					<Form.Item label="Warehouseman" name="Warehouseman" rules={[{ required: true, message: 'Please select a Warehouseman' }]}>
						<Select
							showSearch
							placeholder="Select a Warehouseman"
							optionFilterProp="children"
							filterOption={(input, option) =>
								(option?.children as unknown as string).toLowerCase().includes(input.toLowerCase())
							}
						>
							{filteredUsersWarehouseman.map(user => (
								<Option key={user.id} value={user.id}>
									{user.name}
								</Option>
							))}
						</Select>
					</Form.Item>
					<Form.Item label="Product" name="product" rules={[{ required: true, message: 'Please select a Product' }]}>
						<Select
							showSearch
							placeholder="Select a Product"
							optionFilterProp="children"
							filterOption={(input, option) =>
								(option?.children as unknown as string).toLowerCase().includes(input.toLowerCase())
							}
						>
							{product.map(product => (
								<Option key={product.id} value={product.id}>
									{product.name}
								</Option>
							))}
						</Select>
					</Form.Item>
					<Form.Item label="Warehouse" name="warehouse" rules={[{ required: true, message: 'Please select a Warehouse' }]}>
						<Select
							showSearch
							placeholder="Select a Warehouse"
							optionFilterProp="children"
							filterOption={(input, option) =>
								(option?.children as unknown as string).toLowerCase().includes(input.toLowerCase())
							}
						>
							{warehouses.map(warehouse => (
								<Option key={warehouse.id} value={warehouse.id}>
									{warehouse.building}
								</Option>
							))}
						</Select>
					</Form.Item>
				</>
			)}
			{selectedTaskType === 2 && (
				<>
					<Form.Item label="Warehouseman" name="Warehouseman" rules={[{ required: true, message: 'Please select a Warehouseman' }]}>
						<Select
							showSearch
							placeholder="Select a Warehouseman"
							optionFilterProp="children"
							filterOption={(input, option) =>
								(option?.children as unknown as string).toLowerCase().includes(input.toLowerCase())
							}
						>
							{filteredUsersWarehouseman.map(user => (
								<Option key={user.id} value={user.id}>
									{user.name}
								</Option>
							))}
						</Select>
					</Form.Item>
					<Form.Item label="Product" name="product" rules={[{ required: true, message: 'Please select a Product' }]}>
						<Select
							showSearch
							placeholder="Select a Product"
							optionFilterProp="children"
							filterOption={(input, option) =>
								(option?.children as unknown as string).toLowerCase().includes(input.toLowerCase())
							}
						>
							{product.map(product => (
								<Option key={product.id} value={product.id}>
									{product.name}
								</Option>
							))}
						</Select>
					</Form.Item>
					<Form.Item label="Warehouse" name="warehouse" rules={[{ required: true, message: 'Please select a Warehouse' }]}>
						<Select
							showSearch
							placeholder="Select a Warehouse"
							optionFilterProp="children"
							filterOption={(input, option) =>
								(option?.children as unknown as string).toLowerCase().includes(input.toLowerCase())
							}
						>
							{warehouses.map(warehouse => (
								<Option key={warehouse.id} value={warehouse.id}>
									{warehouse.building}
								</Option>
							))}
						</Select>
					</Form.Item>
				</>
			)}
			{selectedTaskType === 3 && (
				<>
					<Form.Item label="Warehouseman" name="Warehouseman" rules={[{ required: true, message: 'Please select a Warehouseman' }]}>
						<Select
							showSearch
							placeholder="Select a Warehouseman"
							optionFilterProp="children"
							filterOption={(input, option) =>
								(option?.children as unknown as string).toLowerCase().includes(input.toLowerCase())
							}
						>
							{filteredUsersWarehouseman.map(user => (
								<Option key={user.id} value={user.id}>
									{user.name}
								</Option>
							))}
						</Select>
					</Form.Item>
					<Form.Item label="Product" name="product" rules={[{ required: true, message: 'Please select a Product' }]}>
						<Select
							showSearch
							placeholder="Select a Product"
							optionFilterProp="children"
							filterOption={(input, option) =>
								(option?.children as unknown as string).toLowerCase().includes(input.toLowerCase())
							}
						>
							{product.map(product => (
								<Option key={product.id} value={product.id}>
									{product.name}
								</Option>
							))}
						</Select>
					</Form.Item>
					<Form.Item label="Move from" name="warehouse" rules={[{ required: true, message: 'Please select a Warehouse' }]}>
						<Select
							showSearch
							placeholder="Select a Warehouse"
							optionFilterProp="children"
							filterOption={(input, option) =>
								(option?.children as unknown as string).toLowerCase().includes(input.toLowerCase())
							}
						>
							{warehouses.map(warehouse => (
								<Option key={warehouse.id} value={warehouse.id}>
									{warehouse.building}
								</Option>
							))}
						</Select>
					</Form.Item>
					<Form.Item label="Move to" name="warehouse1" rules={[{ required: true, message: 'Please select a Warehouse' }]}>
						<Select
							showSearch
							placeholder="Select a Warehouse"
							optionFilterProp="children"
							filterOption={(input, option) =>
								(option?.children as unknown as string).toLowerCase().includes(input.toLowerCase())
							}
						>
							{warehouses.map(warehouse => (
								<Option key={warehouse.id} value={warehouse.id}>
									{warehouse.building}
								</Option>
							))}
						</Select>
					</Form.Item>
				</>
			)}
			{selectedTaskType === 4 && (
				<>
					<Form.Item label="Warehouseman" name="Warehouseman" rules={[{ required: true, message: 'Please select a Warehouseman' }]}>
						<Select
							showSearch
							placeholder="Select a Warehouseman"
							optionFilterProp="children"
							filterOption={(input, option) =>
								(option?.children as unknown as string).toLowerCase().includes(input.toLowerCase())
							}
						>
							{filteredUsersWarehouseman.map(user => (
								<Option key={user.id} value={user.id}>
									{user.name}
								</Option>
							))}
						</Select>
					</Form.Item>
					<Form.Item label="Printer" name="printer" rules={[{ required: true, message: 'Please select a Printer' }]}>
						<Select
							showSearch
							placeholder="Select a Printer"
							optionFilterProp="children"
							filterOption={(input, option) =>
								(option?.children as unknown as string).toLowerCase().includes(input.toLowerCase())
							}
						>
							{filteredUsersPrinter.map(user => (
								<Option key={user.id} value={user.id}>
									{user.name}
								</Option>
							))}
						</Select>
					</Form.Item>
					<Form.Item label="Warehouseman" name="Warehouseman" rules={[{ required: true, message: 'Please select a Warehouseman' }]}>
						<Select
							showSearch
							placeholder="Select a Warehouseman"
							optionFilterProp="children"
							filterOption={(input, option) =>
								(option?.children as unknown as string).toLowerCase().includes(input.toLowerCase())
							}
						>
							{filteredUsersWarehouseman.map(user => (
								<Option key={user.id} value={user.id}>
									{user.name}
								</Option>
							))}
						</Select>
					</Form.Item>
				</>
			)}
			{selectedTaskType === 5 && (
				<>
					<Form.Item label="Admin" name="admin" rules={[{ required: true, message: 'Please select an admin' }]}>
						<Select
							showSearch
							placeholder="Select an admin"
							optionFilterProp="children"
							filterOption={(input, option) =>
								(option?.children as unknown as string).toLowerCase().includes(input.toLowerCase())
							}
						>
							{filteredUsersAdmin.map(user => (
								<Option key={user.id} value={user.id}>
									{user.name}
								</Option>
							))}
						</Select>
					</Form.Item>
				</>
			)}
			{selectedTaskType === 6 && (
				<>
					<Form.Item label="Admin" name="admin" rules={[{ required: true, message: 'Please select an admin' }]}>
						<Select
							showSearch
							placeholder="Select an admin"
							optionFilterProp="children"
							filterOption={(input, option) =>
								(option?.children as unknown as string).toLowerCase().includes(input.toLowerCase())
							}
						>
							{filteredUsersAdmin.map(user => (
								<Option key={user.id} value={user.id}>
									{user.name}
								</Option>
							))}
						</Select>
					</Form.Item>
				</>
			)}
			<Form.Item>
				<Button type="primary" htmlType="submit">
					Create Task
				</Button>
				<Button onClick={onClose} style={{ marginLeft: '8px' }}>
					Cancel
				</Button>
			</Form.Item>
		</Form>
	);
};

export default TaskForm;
