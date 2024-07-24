// src/components/forms/admin/TaskReportForm.tsx

import React from "react";
import { Form, Select, Switch, Row } from "antd";
import { TaskReturn } from "../../../service/tasks/types";

interface TaskReportFormProps {
	tasks: TaskReturn[];
	includeUsers: boolean;
	setIncludeUsers: (value: boolean) => void;
	includeProducts: boolean;
	setIncludeProducts: (value: boolean) => void;
	includeWarehouses: boolean;
	setIncludeWarehouses: (value: boolean) => void;
	includePieChart: boolean;
	setIncludePieChart: (value: boolean) => void;
	selectedTasks: string[];
	setSelectedTasks: (value: string[]) => void;
	selectedUser: string;
	setSelectedUser: (value: string) => void;
	selectState: string[];
	setSelectState: (value: string[]) => void;
	selectPriority: string[];
	setSelectPriority: (value: string[]) => void;
}

const TaskReportForm: React.FC<TaskReportFormProps> = ({
	tasks,
	includeUsers,
	setIncludeUsers,
	includeProducts,
	setIncludeProducts,
	includeWarehouses,
	setIncludeWarehouses,
	includePieChart,
	setIncludePieChart,
	selectedUser,
	setSelectedUser,
	selectState,
	setSelectState,
	selectPriority,
	setSelectPriority,
}) => {
	return (
		<Form layout='vertical'>
			<Row>
				<Form.Item label='Include Users' name='includeUsers' valuePropName='checked'>
					<Switch checked={includeUsers} onChange={setIncludeUsers} />
				</Form.Item>
				<Form.Item label='Include Products' name='includeProducts' valuePropName='checked'>
					<Switch checked={includeProducts} onChange={setIncludeProducts} />
				</Form.Item>
				<Form.Item label='Include Warehouses' name='includeWarehouses' valuePropName='checked'>
					<Switch checked={includeWarehouses} onChange={setIncludeWarehouses} />
				</Form.Item>
				<Form.Item label='Include Pie Chart' name='includePieChart' valuePropName='checked'>
					<Switch checked={includePieChart} onChange={setIncludePieChart} />
				</Form.Item>
			</Row>

			<Form.Item label='Users' name='users' rules={[{ required: false, message: "Please select users" }]}>
				<Select value={selectedUser} onChange={setSelectedUser}>
					{tasks.map((task) =>
						task.users.map((user: any) => (
							<Select.Option key={user.id} value={user.id}>
								{user.name} {user.lastname}
							</Select.Option>
						))
					)}
				</Select>
			</Form.Item>
			<Form.Item label='State' name='state' rules={[{ required: false, message: "Please select state" }]}>
				<Select value={selectState} onChange={setSelectState}>
					{tasks.map((task) => (
						<Select.Option key={task.state} value={task.state}>
							{task.state}
						</Select.Option>
					))}
				</Select>
			</Form.Item>
			<Form.Item label='Priority' name='priority' rules={[{ required: false, message: "Please select priority" }]}>
				<Select value={selectPriority} onChange={setSelectPriority}>
					{tasks.map((task) => (
						<Select.Option key={task.priority} value={task.priority}>
							{task.priority}
						</Select.Option>
					))}
				</Select>
			</Form.Item>
		</Form>
	);
};

export default TaskReportForm;
