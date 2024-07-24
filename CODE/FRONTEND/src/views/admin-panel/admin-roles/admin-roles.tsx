import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import { Breadcrumb, Drawer, Form, Input, Row, Space, Button } from "antd";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import { DataGrid, GridColDef, GridActionsCellItem, GridRowId } from "@mui/x-data-grid";
import { Typography } from "@mui/material";
import { GetTasks, DeleteTasks, PostTask, PutTask } from "../../../service/users";
import { TaskValuesType } from "../../../service/users/types";
import { useAxios } from "../../../helpers/axios/useAxios";



export const AdminRole = () => {

	const axios = useAxios();

	const [rows, setRows] = useState<TaskValuesType[]>([]); 
	const [open, setOpen] = useState(false);
	const [open1, setOpen1] = useState(false);
	const [id, setId] = useState<GridRowId>("");

	const onClose1 = () => {
		setOpen1(false);
	};

	const showDrawer = () => {
		setOpen(true);
	};

	const onClose = () => {
		setOpen(false);
	};

	const getAllTasks = async () => {
		try {
			const res = await GetTasks(axios);
			console.log(res);
			setRows(res);
		} catch (error) {
			console.error("Error fetching tasks:", error);
		}
	};

	const handleDeleteClick = (id: GridRowId) => async () => {
		const success = await DeleteTasks(id.toString(), axios);
		if (success) {
			// Jeśli usunięto zadanie pomyślnie, odświeżamy listę zadań
			getAllTasks();
			setRows(rows.filter((row) => row.id !== id));
		}
	};
	const [form] = Form.useForm();
	const formData = Form.useWatch("name", form);

	const handleSubmitClick = async () => {
		try {
			const newTask: TaskValuesType = {
				id: "123",
				name: formData,
			};

			const success = await PostTask(newTask, axios);

			if (success) {
				getAllTasks();
				onClose();
			} else {
				console.error("Błąd podczas dodawania zadania.");
			}
		} catch (error) {
			console.error("Błąd podczas przetwarzania formularza:", error);
		}
	};

	const handleEditClick = (id: GridRowId) => async () => {
		setId(id);
		setOpen1(true);
	};

	const [form1] = Form.useForm();
	const formData1 = Form.useWatch("name1", form);

	const handleEditSubmitClick = () => async () => {
		try {
			const newTask: TaskValuesType = {
				id: id.toString(),
				name: formData1,
			};

			const success = await PutTask(newTask, axios);

			if (success) {
				getAllTasks();
				onClose1();
			} else {
				console.error("Błąd podczas dodawania zadania.");
			}
		} catch (error) {
			console.error("Błąd podczas przetwarzania formularza:", error);
		}
	};

	useEffect(() => {
		getAllTasks();
	}, []);

	const columns: GridColDef[] = [
		{ field: "id", headerName: "ID", width: 70 },
		{ field: "name", headerName: "Name", width: 130, flex: 1 },

		{
			field: "actions",
			type: "actions",
			headerName: "Actions",
			width: 100,
			cellClassName: "actions",
			align: "right",
			getActions: ({ id }) => {
				return [
					<GridActionsCellItem
						icon={<DeleteIcon />}
						label='Save'
						sx={{
							color: "primary.main",
						}}
						onClick={handleDeleteClick(id)}
					/>,
					<GridActionsCellItem
						icon={<EditIcon />}
						label='Cancel'
						className='textPrimary'
						onClick={handleEditClick(id)}
						color='inherit'
					/>,
				];
			},
		},
	];

	return (
		<Box>
			<Box
				sx={{
					height: 500,
					width: "100%",
				}}
			>
				<Breadcrumb style={{ margin: "16px 0" }}>
					<Breadcrumb.Item>Dashboard</Breadcrumb.Item>
					<Breadcrumb.Item>Task</Breadcrumb.Item>
				</Breadcrumb>
				<Typography
					variant='h3'
					component='h3'
					sx={{
						textAlign: "center",
						p: 5,
					}}
				>
					Manage Tasks
				</Typography>
				<Button type='primary' onClick={showDrawer}>
					Add Task
				</Button>
				<DataGrid
					rows={rows}
					columns={columns}
					initialState={{
						pagination: {
							paginationModel: { page: 0, pageSize: 5 },
						},
					}}
					pageSizeOptions={[5, 10]}
				/>
				<Drawer
					title='Create a new Role'
					width={720}
					onClose={onClose}
					open={open}
					styles={{
						body: {
							paddingBottom: 80,
						},
					}}
					extra={
						<Space>
							<Button onClick={onClose}>Cancel</Button>
							<Button onClick={handleSubmitClick} type='primary'>
								Submit
							</Button>
						</Space>
					}
				>
					<Form layout='vertical' hideRequiredMark form={form}>
						<Row>
							<Form.Item
								name='name'
								label='Role Name'
								rules={[{ required: true, message: "Please enter role name" }]}
								style={{
									flex: 1,
								}}
							>
								<Input placeholder='Please enter role name' />
							</Form.Item>
						</Row>
					</Form>
				</Drawer>

				<Drawer
					title='Edit a Role'
					width={720}
					onClose={onClose1}
					open={open1}
					styles={{
						body: {
							paddingBottom: 80,
						},
					}}
					extra={
						<Space>
							<Button onClick={onClose1}>Cancel</Button>
							<Button onClick={handleEditSubmitClick()} type='primary'>
								Submit
							</Button>
						</Space>
					}
				>
					<Form layout='vertical' hideRequiredMark form={form1}>
						<Row>
							<Form.Item
								name='name1'
								label='Role Name'
								rules={[{ required: true, message: "Please enter role name" }]}
								style={{
									flex: 1,
								}}
							>
								<Input placeholder='Please enter role name' />
							</Form.Item>
						</Row>
					</Form>
				</Drawer>
			</Box>
		</Box>
	);
};

export default AdminRole;
