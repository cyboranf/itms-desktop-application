import React, { useState } from "react";
import Box from "@mui/material/Box";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import {
	GridRowModesModel,
	GridRowModes,
	DataGrid,
	GridColDef,
	GridActionsCellItem,
	GridEventListener,
	GridRowId,
	GridRowModel,
	GridRowEditStopReasons,
} from "@mui/x-data-grid";
import { Breadcrumb, Button,Drawer, Space, Form, Select } from "antd";
import { DeleteTask, PostTask, getAllTasks, requestTaskReport } from "../../../service/tasks";
import { Task } from "../../../service/tasks/types";
import TaskForm from "../../../components/forms/admin/admin-taks-form";
import TaskReportForm from "../../../components/forms/admin/admin-taks-form-raport";
import { useAxios } from "../../../helpers/axios/useAxios";
import { Link } from "react-router-dom";
import { Items } from "../../../service/items/types";
import { getAllItems, requestItemsReport } from "../../../service/items";
import { Warehouse } from "../../../service/warehouses/types";
import { getAllWarehouses, requestWarehouseReport } from "../../../service/warehouses";
import UserReportForm from "../../../components/forms/admin/admin-user-form-raport";
import { User } from "../../../service/users/types";
import { getAllUsers, requestUsersReport } from "../../../service/users";
export const ManagerTasks = () => {
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
	const [selectName, setSelectName] = useState<string[]>([]);
	const [selectCode, setSelectCode] = useState<string[]>([]);
	const [items, setItems] = useState<Items[]>([]);
	const [warehouse, setWarhouse] = useState<Warehouse[]>([]);
	const [selectBultind, setSelectedBulidn] = useState<string[]>([]);
	const [selectZone, setSelectedZone] = useState<string[]>([]);
	const [selectspaceId, setSelectedspaceId] = useState<string[]>([]);
	const [selectUserName, setSelectUserName] = useState<string[]>([]);
	const [selectEmail, setSelectEmail] = useState<string[]>([]);
	const [selectPhoneNumber, setSelectPhoneNumber] = useState<string[]>([]);
	const [includeUsers1, setIncludeUsers1] = useState(false);
	const [user, setUser] = useState<User[]>([]);

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

	const getReportsItems = async () => {
		requestItemsReport(selectName, selectCode,axios);
	  };
	const getReportsWarhouse = async () => {
		requestWarehouseReport(selectBultind,
			selectZone,
			selectspaceId,
			axios);
	  };
	  const getReportsUser = async () => {
		try {
		  await requestUsersReport(
			includeUsers1,
			selectUserName,
			selectEmail,
			selectPhoneNumber,
			axios
		  );
		} catch (err) {
		  console.error("Error requesting user report:", err);
		}
	  };
	

	const getTasks = async () => {
		try {
			const res = await getAllTasks(axios);
			setTasks(res.tasks);
		} catch (err: unknown) {
			console.log(err);
		}
	};

	const getItems = async () => {
		try {
			const res = await getAllItems(axios);
			setItems(res.items);
		} catch (err: unknown) {
			console.log(err);
		}
	};

	const getWarehouse = async () => {
		try {
			const res = await getAllWarehouses(axios);
			setWarhouse(res);
		} catch (err: unknown) {
			console.log(err);
		}
	};

	const getUser = async () => {
		try {
			const res = await getAllUsers(axios);
			setUser(res.users);
		} catch (err: unknown) {
			console.log(err);
		}
	}

	React.useEffect(() => {
		getWarehouse();
		getTasks();
		getItems();
		getUser();
	}, []);

	const handleRowEditStop: GridEventListener<"rowEditStop"> = (params, event) => {
		if (params.reason === GridRowEditStopReasons.rowFocusOut) {
			event.defaultMuiPrevented = true;
		}
	};

	const handleEditClick = (id: GridRowId) => () => {
		setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
	};

	const handleDeleteClick = (id: GridRowId) => () => {
		DeleteTask(id.toString(),axios);
		setTasks(tasks.filter((row) => row.id !== id));
	};

	const processRowUpdate = (newRow: GridRowModel) => {
		return newRow;
	};

	const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
		setRowModesModel(newRowModesModel);
	};

	const showDrawer = () => {
		setOpen(true);
	};
	const showDrawer1 = () => {
		setOpen1(true);
	};


	const showDrawer2 = () => {
		setOpen2(true);
	}
	const showDrawer3 = () => {
		setOpen3(true);
	}

	const showReportDrawer = () => {
		setOpenReportDrawer(true);
	  };
	
	  const onCloseReportDrawer = () => {
		setOpenReportDrawer(false);
	  };

	const [open, setOpen] = useState(false);
	const [open1, setOpen1] = useState(false);
	const [open2, setOpen2] = useState(false);
	const [open3, setOpen3] = useState(false);
	const [openReportDrawer, setOpenReportDrawer] = useState(false);

	const [form] = Form.useForm();

	const onClose = () => {
		setOpen(false);
	};

	const onClose1 = () => {
		setOpen1(false);
	};

	const onClose2 = () => {
		setOpen2(false);
	  };
	  const onClose3 = () => {
		setOpen3(false);
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
					<GridActionsCellItem icon={<EditIcon />} label='Edit' onClick={handleEditClick(id)} />,
					<GridActionsCellItem icon={<DeleteIcon />} label='Delete' onClick={handleDeleteClick(id)} />,
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
					<Breadcrumb.Item>Dashboard</Breadcrumb.Item>
					<Breadcrumb.Item>Manager Panel</Breadcrumb.Item>
					<Breadcrumb.Item>Manage Task</Breadcrumb.Item>
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
				
				 
				<Drawer
                title='Create a new Raport'
                width={720}
                onClose={onClose2}
                open={open2}
                bodyStyle={{ paddingBottom: 80 }}
                extra={
                  <Space>
                    <Button onClick={onClose2}>Cancel</Button>
                    <Button onClick={getReportsItems} type='primary'>
                      Submit
                    </Button>
                  </Space>
                }
              >
                   <Form layout="vertical">
				
						<Form.Item label="Name" name="name" rules={[{ required: false, message: "Please select name" }]}>
							<Select value={selectName} onChange={setSelectName}>
							{items.map((row) => (
								<Select.Option key={row.name} value={row.name}>
								{row.name}
								</Select.Option>
							))}
							</Select>
						</Form.Item>

						<Form.Item label="Code" name="code" rules={[{ required: false, message: "Please select code" }]}>
							<Select value={selectCode} onChange={setSelectCode}>
							{items.map((row) => (
								<Select.Option key={row.code} value={row.code}>
								{row.code}
								</Select.Option>
							))}
							</Select>
						</Form.Item>
						</Form>
              </Drawer>
			

			  <Drawer
            title="Create Report"
            width={720}
            onClose={onCloseReportDrawer}
            open={openReportDrawer}
            bodyStyle={{ paddingBottom: 80 }}
            extra={
              <Space>
                <Button onClick={onCloseReportDrawer}>Cancel</Button>
                <Button onClick={getReportsWarhouse} type="primary">
                  Submit
                </Button>
              </Space>
            }
          >
            <Form layout="vertical">
              <Form.Item label="Building" name="building">
                <Select value={selectBultind} onChange={setSelectedBulidn}>
                  {warehouse.map((row) => (
                    <Select.Option key={row.building} value={row.building}>
                      {row.building}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item label="Zone" name="zone">
                <Select value={selectZone} onChange={setSelectedZone}>
                  {warehouse.map((row) => (
                    <Select.Option key={row.zone} value={row.zone}>
                      {row.zone}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

			  <Form.Item label="SpaceId" name="spaceId" rules={[{ required: false, message: "Please select spaceId" }]}>
							<Select value={selectspaceId} onChange={setSelectedspaceId}>
							{warehouse.map((row) => (
								<Select.Option key={row.spaceId} value={row.spaceId}>
								{row.spaceId}
								</Select.Option>
							))}
							</Select>
			</Form.Item>
            </Form>
          </Drawer>
		  <Drawer
            title="Create a new Report"
            width={720}
            onClose={onClose3}
            open={open3}
            bodyStyle={{ paddingBottom: 80 }}
            extra={
              <Space>
                <Button onClick={onClose3}>Cancel</Button>
                <Button onClick={getReportsUser} type="primary">
                  Submit
                </Button>
              </Space>
            }
          >
            <UserReportForm
              includeUsers={includeUsers1}
              setIncludeUsers={setIncludeUsers1}
              selectUserName={selectUserName}
              setSelectUserName={setSelectUserName}
              selectEmail={selectEmail}
              setSelectEmail={setSelectEmail}
              selectPhoneNumber={selectPhoneNumber}
              setSelectPhoneNumber={setSelectPhoneNumber}
              rows={user}
            />
          </Drawer>

				<div className="container">
					<button onClick={showDrawer} className="button-gradient" style={{ marginRight: '10px',  }} >
						Add Task
					</button>
					<button className="button-gradient" style={{ marginRight: '10px' }}>
						<Link to="/manager/finnished-tasks" style={{color: "black"}}>Show Finished Tasks</Link>
					</button>
					<button onClick={showDrawer3} className="button-gradient" style={{ marginRight: '10px' }}>
						Creat Raport Users
					</button>
					<button onClick={showReportDrawer} className="button-gradient" style={{ marginRight: '10px' }}>
						Creat Raport Warhouse
					</button>
					<button onClick={showDrawer2} className="button-gradient" style={{ marginRight: '10px' }}>
						Creat Raport Products
					</button>
					<button onClick={showDrawer1} className="button-gradient" style={{ marginRight: '10px' }}>
						Creat Raport Tasks
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

export default ManagerTasks;
