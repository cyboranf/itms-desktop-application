import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import { useNavigate } from "react-router-dom";
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
import { Breadcrumb, Button, Drawer, Space, Form, Select } from "antd";
import { deleteWarehouse, getAllWarehouses, requestWarehouseReport } from "../../../service/warehouses";
import { Warehouse } from "../../../service/warehouses/types";
import { useAxios } from "../../../helpers/axios/useAxios";
import WarehouseForm from "../../../components/forms/admin/admin-warhouse-form";

export const AdminWarehouse = () => {
  const navigate = useNavigate();
  const [rows, setRows] = useState<Warehouse[]>([]);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [warehouseToDelete, setWarehouseToDelete] = useState<Warehouse | null>(null);
  const [openReportDrawer, setOpenReportDrawer] = useState(false);
  const [selectBultind, setSelectedBulidn] = useState<string[]>([]);
  const [selectZone, setSelectedZone] = useState<string[]>([]);
  const [selectspaceId, setSelectedspaceId] = useState<string[]>([]);

  const axios = useAxios();

  const getWarehousesData = async () => {
    try {
      const res = await getAllWarehouses(axios);
      setRows(res);
    } catch (err: unknown) {
      console.error(err);
    }
  };

  useEffect(() => {
    getWarehousesData();
  }, []);

  const handleRowEditStop: GridEventListener<"rowEditStop"> = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id: GridRowId) => () => {
    const warehouse = rows.find((row) => row.id === id);
    if (warehouse) {
      setSelectedWarehouse(warehouse);
      setOpenDrawer(true);
    }
  };

  const handleDeleteClick = (id: number) => () => {
    const warehouse = rows.find((row) => row.id === id);
    if (warehouse) {
      setWarehouseToDelete(warehouse);
      setIsDeleteModalVisible(true);
    }
  };

  const confirmDelete = async () => {
    if (warehouseToDelete) {
      await deleteWarehouse(warehouseToDelete.id, axios);
      getWarehousesData();
      setIsDeleteModalVisible(false);
    }
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const showDrawer = () => {
    setSelectedWarehouse(null);
    setOpenDrawer(true);
  };

  const onCloseDrawer = () => {
    setOpenDrawer(false);
    setSelectedWarehouse(null);
  };

  const showReportDrawer = () => {
    setOpenReportDrawer(true);
  };

  const onCloseReportDrawer = () => {
    setOpenReportDrawer(false);
  };

  const getReports = async () => {
    await requestWarehouseReport(
		selectBultind,
      selectZone,
      selectspaceId,
      axios
    );
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
      field: "building",
      headerName: "Building",
      width: 180,
      editable: false,
    },
    {
      field: "zone",
      headerName: "Zone",
      width: 180,
      editable: false,
    },
    {
      field: "spaceId",
      headerName: "Space Id",
      width: 180,
      editable: false,
    },
    {
      field: "spaceHeight",
      headerName: "Space Height",
      width: 100,
      editable: false,
    },
    {
      field: "spaceWidth",
      headerName: "Space Width",
      width: 220,
      editable: false,
    },
    {
      field: "spaceLength",
      headerName: "Space Length",
      width: 220,
      editable: false,
      flex: 1,
    },
    {
      field: "productName",
      headerName: "Product",
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
          label="Edit"
          className="textPrimary"
          onClick={handleEditClick(id)}
          color="inherit"
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Delete"
          onClick={handleDeleteClick(Number(id))}
          color="inherit"
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
            <Breadcrumb.Item>Admin Panel</Breadcrumb.Item>
            <Breadcrumb.Item>Manage Warehouses</Breadcrumb.Item>
          </Breadcrumb>

          <div className="container">
            <button className="button-gradient" style={{ marginRight: 'auto' }} onClick={showDrawer}>
              Add Warehouse
            </button>
            <button className="button-gradient" style={{ marginLeft: '10px' }} onClick={showReportDrawer}>
              Create Report
            </button>
          </div>

          <Drawer
            title={selectedWarehouse ? "Edit Warehouse" : "Create a new Warehouse"}
            width={720}
            onClose={onCloseDrawer}
            open={openDrawer}
            bodyStyle={{ paddingBottom: 80 }}
            extra={
              <Space>
                <Button onClick={onCloseDrawer}>Cancel</Button>
                <Button onClick={form.submit} type="primary">
                  Submit
                </Button>
              </Space>
            }
          >
            <WarehouseForm
              form={form}
              onClose={onCloseDrawer}
              refreshWarehouses={() => {
                getWarehousesData();
              }}
              refreshWarehouse={() => {
                setSelectedWarehouse(null);
              }}
              initialValues={selectedWarehouse}
            />
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
                <Button onClick={getReports} type="primary">
                  Submit
                </Button>
              </Space>
            }
          >
            <Form layout="vertical">
              <Form.Item label="Building" name="building">
                <Select value={selectBultind} onChange={setSelectedBulidn}>
                  {rows.map((row) => (
                    <Select.Option key={row.building} value={row.building}>
                      {row.building}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item label="Zone" name="zone">
                <Select value={selectZone} onChange={setSelectedZone}>
                  {rows.map((row) => (
                    <Select.Option key={row.zone} value={row.zone}>
                      {row.zone}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

			  <Form.Item label="SpaceId" name="spaceId" rules={[{ required: false, message: "Please select spaceId" }]}>
							<Select value={selectspaceId} onChange={setSelectedspaceId}>
							{rows.map((row) => (
								<Select.Option key={row.spaceId} value={row.spaceId}>
								{row.spaceId}
								</Select.Option>
							))}
							</Select>
			</Form.Item>
            </Form>
          </Drawer>

          <DataGrid
            rows={rows}
            columns={columns}
            editMode="row"
            rowModesModel={rowModesModel}
            onRowModesModelChange={handleRowModesModelChange}
            onRowEditStop={handleRowEditStop}
            style={{ flex: 1, minHeight: 0, width: "100%" }}
            sx={{
              "& .MuiDataGrid-footerContainer ": {
                bgcolor: "#b3d5e0",
                height: "30px",
              },
            }}
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
            <Typography variant="h4" component="div" sx={{ color: "red", fontWeight: "bold" }}>
              Delete Warehouse
            </Typography>
          </DialogTitle>
          <DialogContent>
            <DialogContentText>Are you sure you want to delete this warehouse?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsDeleteModalVisible(false)}>Cancel</Button>
            <Button onClick={confirmDelete}>Delete</Button>
          </DialogActions>
        </Box>
      </Modal>
    </>
  );
};

export default AdminWarehouse;
