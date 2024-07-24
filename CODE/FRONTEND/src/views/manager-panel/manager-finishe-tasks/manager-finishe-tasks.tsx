import React, { useState } from "react";
import Box from "@mui/material/Box";
import DoneIcon from '@mui/icons-material/Done';
import {
	GridRowModesModel,
	DataGrid,
	GridColDef,
	GridActionsCellItem,
	GridEventListener,
	GridRowId,
	GridRowModel,
	GridRowEditStopReasons,
} from "@mui/x-data-grid";
import { Form, Button, Breadcrumb, Drawer, Space } from "antd";
import { PostTask, TaskFinished, getAllTasks, getAllTasksSelf, requestTaskReport } from "../../../service/tasks";
import { Task } from "../../../service/tasks/types";
import TaskForm from "../../../components/forms/admin/admin-taks-form";
import TaskReportForm from "../../../components/forms/admin/admin-taks-form-raport";
import { useAxios } from "../../../helpers/axios/useAxios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

export const MenagerFinishedTasks = () => {
	const axios = useAxios();

	const [tasks, setTasks] = React.useState<Task[]>([]);
	const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({});
	const [includeUsers, setIncludeUsers] = useState(false);
	const [includeProducts, setIncludeProducts] = useState(false);
	const [includeWarehouses, setIncludeWarehouses] = useState(false);
	const [includePieChart, setIncludePieChart] = useState(false);
	const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
	const [selectedUser, setSelectedUser] = useState<string>("");
	const [selectState, setSelectState] = useState<string[]>([]);
	const [selectPriority, setSelectPriority] = useState<string[]>([]);

	const getReports = async () => {
		console.log(selectPriority);
		requestTaskReport(
			includeUsers,
			includeProducts,
			includeWarehouses,
			includePieChart,
			selectedTasks,
			selectedUser,
			selectPriority,
			selectState,
			axios
		);
	};

	const getTasks = async () => {
		try {
			const res = await getAllTasksSelf(axios);
			setTasks(res.tasks);
		} catch (err: unknown) {
			console.log(err);
		}
	};

	React.useEffect(() => {
		getTasks();
	}, []);

	const handleRowEditStop: GridEventListener<"rowEditStop"> = (params, event) => {
		if (params.reason === GridRowEditStopReasons.rowFocusOut) {
			event.defaultMuiPrevented = true;
		}
	};

	const handleDoneIcon = async (id: GridRowId) => {
		const task = await TaskFinished(id.toString(), axios);

		if (task) {
			toast.success("Task Complidet");
			getAllTasksSelf(axios);
		} else {
			toast.success("Error whit ending the task");
		}
	};



	const processRowUpdate = (newRow: GridRowModel) => {
		return newRow;
	};

	const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
		setRowModesModel(newRowModesModel);
	};

	const showDrawer1 = () => {
		setOpen1(true);
	};

	const [open, setOpen] = useState(false);
	const [open1, setOpen1] = useState(false);

	const [form] = Form.useForm();

	const onClose = () => {
		setOpen(false);
	};

	const onClose1 = () => {
		setOpen1(false);
	};

	const handleCreateTask = () => {
		try {
			form
				.validateFields()
				.then(async (values) => {
					const newTaskt = {
						users: null,
						description: values.description,
						endDate: values.endDate,
						id: values.idd,
						name: values.name,
						priority: values.priority,
						startDate: values.startDate,
						state: values.state,
						type_id: values.type_id,
						creationDate: Date().toString(),
					};

					const success = await PostTask(newTaskt, axios);
					if (success) {
						getAllTasks(axios);
						onClose();
					} else {
						console.error("Error while adding the task.");
					}
				})
				.catch((error) => {
					console.error("Form processing error:", error);
				});
		} catch (error) {
			console.error("Error during form submission:", error);
		}
	};

	const columns: GridColDef[] = [
		{ field: "name", headerName: "Name", width: 180, editable: false },
		{ field: "priority", headerName: "Priority", width: 180, align: "left", headerAlign: "left", editable: false },
		{ field: "creationDate", headerName: "Creation Date", width: 180, editable: false },
		{ field: "startDate", headerName: "Creation Date", width: 180, editable: false },
		{ field: "endDate", headerName: "End Date", width: 180, editable: false },
		{ field: "state", headerName: "Status", width: 60, editable: false, flex: 1 },
		{
			field: "warehouses",
			headerName: "Warehouse Details",
			width: 300,
			renderCell: (params) => (
				<span>{params.value.map((warehouse: any) => `${warehouse.building}-${warehouse.zone}`).join(", ")}</span>
			),
		},
		{
			field: "users",
			headerName: "Workers Details",
			width: 300,
			renderCell: (params) => (
				<span>{params.value.map((users: any) => `${users.name} ${users.lastname}`).join(", ")}</span>
			),
		},
		{
			field: "products",
			headerName: "Products Details",
			width: 300,
			renderCell: (params) => (
				<span>{params.value.map((products: any) => `${products.name}-${products.code}`).join(", ")}</span>
			),
		},
		{
			field: "actions",
			type: "actions",
			headerName: "Actions",
			width: 100,
			cellClassName: "actions",
			align: "right",
			getActions: ({ id }) => {
				return [
					<GridActionsCellItem icon={<DoneIcon />} label='Edit' onClick={() => handleDoneIcon(id)} />,
				];
			},
		},
	];

	return (
		<Box>
			<Box
				sx={{
					height: "89.5vh",
					width: "100%",
					"& .actions": {
						color: "text.secondary",
					},
					"& .textPrimary": {
						color: "text.primary",
					},
				}}
			>
				<Breadcrumb style={{ margin: "12px 0", fontSize: "22px", fontWeight: "bold" }}>
                    <Breadcrumb.Item><Link to="/manager/home">Dashboard</Link></Breadcrumb.Item>
                    <Breadcrumb.Item><Link to="">Manager Panel</Link> </Breadcrumb.Item>
					<Breadcrumb.Item><Link to="/manager/tasks">Manage Task</Link> </Breadcrumb.Item>
					<Breadcrumb.Item>Finished Task</Breadcrumb.Item>
				</Breadcrumb>

				<Drawer
					title='Create a new Task'
					width={720}
					onClose={onClose}
					open={open}
					bodyStyle={{ paddingBottom: 80 }}
					extra={
						<Space>
							<Button onClick={onClose}>Cancel</Button>
							<Button onClick={handleCreateTask} type='primary'>
								Submit
							</Button>
						</Space>
					}
				>
					<TaskForm form={form} onClose={onClose} handleCreateTask={handleCreateTask} />
				</Drawer>

				<Drawer
					title='Create a Report'
					width={720}
					onClose={onClose1}
					open={open1}
					bodyStyle={{ paddingBottom: 80 }}
					extra={
						<Space>
							<Button onClick={onClose1}>Cancel</Button>
							<Button onClick={getReports} type='primary'>
								Submit
							</Button>
						</Space>
					}
				>
					<TaskReportForm
						tasks={tasks}
						includeUsers={includeUsers}
						setIncludeUsers={setIncludeUsers}
						includeProducts={includeProducts}
						setIncludeProducts={setIncludeProducts}
						includeWarehouses={includeWarehouses}
						setIncludeWarehouses={setIncludeWarehouses}
						includePieChart={includePieChart}
						setIncludePieChart={setIncludePieChart}
						selectedTasks={selectedTasks}
						setSelectedTasks={setSelectedTasks}
						selectedUser={selectedUser}
						setSelectedUser={setSelectedUser}
						selectState={selectState}
						setSelectState={setSelectState}
						selectPriority={selectPriority}
						setSelectPriority={setSelectPriority}
					/>
				</Drawer>

				<div className="container">
					<button onClick={showDrawer1} className="button-gradient" style={{ marginRight: '10px' }}>
						Creat Raport
					</button>
				</div>
				<DataGrid
					rows={tasks}
					columns={columns}
					editMode='row'
					rowModesModel={rowModesModel}
					onRowModesModelChange={handleRowModesModelChange}
					onRowEditStop={handleRowEditStop}
					processRowUpdate={processRowUpdate}
					slotProps={{
						toolbar: { setRows: setTasks, setRowModesModel },
					}}
					sx={{
						boxShadow: 2,
						border: 1,
						"& .MuiDataGrid-cell:hover": {
							color: "primary.main",
						},
						"& .MuiDataGrid-footerContainer ": {
							height: "30px",
							bgcolor: '#b3d5e0',
						},
						"& .MuiDataGrid-toolbarContainer  ": {
							height: "30px",
							bgcolor: "#000000",
						},
						"& .MuiButtonBase-root  ": {},
					}}
				/>
			</Box>
		</Box>
	);
};

export default MenagerFinishedTasks;
