import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import {
	GridRowModesModel,
	DataGrid,
	GridColDef,
	GridEventListener,
	GridRowId,
	GridRowEditStopReasons,
	GridActionsCellItem,
} from "@mui/x-data-grid";
import { Typography, Modal, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";
import { Breadcrumb, Button, Drawer, Space, Form } from "antd";
import { Link } from "react-router-dom";
import { getAllItems, deleteItem } from "../../../service/items";
import { Items } from "../../../service/items/types";
import { useAxios } from "../../../helpers/axios/useAxios";
import ProductForm from "../../../components/forms/admin/admin-prodcut-form";

export const PrinterProducts = () => {
	const [rows, setRows] = useState<Items[]>([]);
	const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({});
	const [openDrawer, setOpenDrawer] = useState(false);
	const [selectedProduct, setSelectedProduct] = useState<Items | null>(null);
	const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
	const [productToDelete, setProductToDelete] = useState<Items | null>(null);
	const axios = useAxios();

	const GetItems = async () => {
		try {
			const res = await getAllItems(axios);
			setRows(res.items); // Update local state with fetched data
		} catch (error) {
			console.error("Error fetching items:", error);
		}
	};

	useEffect(() => {
		GetItems();
	}, []);

	const handleRowEditStop: GridEventListener<"rowEditStop"> = (params, event) => {
		if (params.reason === GridRowEditStopReasons.rowFocusOut) {
			event.defaultMuiPrevented = true;
		}
	};

	const handleEditClick = (id: GridRowId) => () => {
		const product = rows.find((row) => row.id === id);
		if (product) {
			setSelectedProduct(product);
			setOpenDrawer(true);
		}
	};

	const handleDeleteClick = (id: number) => () => {
		const product = rows.find((row) => row.id === id);
		if (product) {
			setProductToDelete(product);
			setIsDeleteModalVisible(true);
		}
	};

	const confirmDelete = async () => {
		if (productToDelete) {
			await deleteItem(productToDelete.id, axios);
			GetItems();
			setIsDeleteModalVisible(false);
		}
	};

	const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
		setRowModesModel(newRowModesModel);
	};

	const showDrawer = () => {
		setSelectedProduct(null);
		setOpenDrawer(true);
	};

	const onCloseDrawer = () => {
		setOpenDrawer(false);
	};

	const [form] = Form.useForm();

	const columns: GridColDef[] = [
		{
			field: "id",
			headerName: "ID",
			width: 100,
			editable: false,
		},
		{
			field: "name",
			headerName: "Name",
			width: 180,
			editable: false,
		},
		{
			field: "code",
			headerName: "Code",
			width: 180,
			editable: false,
		},
		{
			field: "width",
			headerName: "Width",
			width: 180,
			editable: false,
		},
		{
			field: "height",
			headerName: "Height",
			width: 100,
			editable: false,
		},
		{
			field: "length",
			headerName: "Length",
			width: 220,
			editable: false,
			flex: 1,
		},
		{
			field: "actions",
			type: "actions",
			headerName: "Actions",
			width: 100,
			cellClassName: "actions",
			align: "right",
			getActions: ({ id }) => [
				<GridActionsCellItem
					icon={<EditIcon />}
					label='Edit'
					className='textPrimary'
					onClick={handleEditClick(id)}
					color='inherit'
				/>,
				<GridActionsCellItem
					icon={<DeleteIcon />}
					label='Delete'
					onClick={handleDeleteClick(Number(id))}
					color='inherit'
				/>,
			],
		},
	];

	return (
		<>
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
						<Breadcrumb.Item>Printer Panel</Breadcrumb.Item>
						<Breadcrumb.Item>
							<Link to='/warehouses' style={{ textDecoration: "none" }}>
								Warehouses
							</Link>
						</Breadcrumb.Item>
						<Breadcrumb.Item>Manage Products</Breadcrumb.Item>
					</Breadcrumb>
					<div className="container">
						<button className="button-gradient" style={{ marginRight: 'auto' }} onClick={showDrawer}>
							Add new product +
						</button>
					</div>

					<Drawer
						title={selectedProduct ? "Edit Product" : "Create a new Product"}
						width={720}
						onClose={onCloseDrawer}
						open={openDrawer}
						bodyStyle={{ paddingBottom: 80 }}
						extra={
							<Space>
								<Button onClick={onCloseDrawer}>Cancel</Button>
								<Button onClick={form.submit} type='primary'>
									Submit
								</Button>
							</Space>
						}
					>
						<ProductForm
							refreshProducts={() => {
								GetItems();
							}}
							form={form}
							onClose={onCloseDrawer}
							initialValues={selectedProduct}
						/>
					</Drawer>

					<DataGrid
						rows={rows}
						columns={columns}
						editMode="row"
						rowModesModel={rowModesModel}
						onRowModesModelChange={handleRowModesModelChange}
						onRowEditStop={handleRowEditStop}
						style={{ flex: 1, minHeight: 0, width: '100%' }}
						sx={{
							"& .MuiDataGrid-footerContainer ": {
								bgcolor: "#b3d5e0",
								height: "30px",
							},
						}} // Ensures DataGrid takes the remaining space
					/>
				</Box>

			</Box>
			<Modal open={isDeleteModalVisible} onClose={() => setIsDeleteModalVisible(false)}>
				<Box
					sx={{
						position: "absolute",
						top: "50%",
						left: "50%",
						transform: "translate(-50%, -50%)",
						width: 400,
						bgcolor: "background.paper",
						boxShadow: 24,
						p: 4,
					}}
				>
					<DialogTitle>
						<Typography variant='h4' component='div' sx={{ color: "red", fontWeight: "bold" }}>
							Delete Product
						</Typography>
					</DialogTitle>
					<DialogContent>
						<DialogContentText>
							<Typography variant='h6' component='div'>
								Are you sure you want to delete the product?
							</Typography>
							{productToDelete && (
								<p>
									Name: {productToDelete.name} <br />
									Code: {productToDelete.code}
								</p>
							)}
						</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button onClick={() => setIsDeleteModalVisible(false)}>Cancel</Button>
						<Button onClick={confirmDelete}>Confirm</Button>
					</DialogActions>
				</Box>
			</Modal>
		</>
	);
};

export default PrinterProducts;
