import "./admin-users.scss";
import React, { useState } from "react";
import Box from "@mui/material/Box";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import {
  GridRowModesModel,
  DataGrid,
  GridColDef,
  GridActionsCellItem,
  GridEventListener,
  GridRowId,
  GridRowEditStopReasons,
} from "@mui/x-data-grid";
import { Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { Breadcrumb, Drawer, Form, Space, Button } from "antd";
import { User } from "../../../service/users/types";
import { DeleteUsers, getAllUsers, requestUsersReport } from "../../../service/users";
import UserForm from "../../../components/forms/admin/admin-users-form";
import UserReportForm from "../../../components/forms/admin/admin-user-form-raport";
import { useAxios } from "../../../helpers/axios/useAxios";
import { Modal, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";


export const AdminPanel = () => {
  const navigate = useNavigate();
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [isDeleteUserOpen, setIsDeleteUserOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  const [rows, setRows] = useState<User[]>([]);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const [includeUsers, setIncludeUsers] = useState(false);
  const [selectUserName, setSelectUserName] = useState<string[]>([]);
  const [selectEmail, setSelectEmail] = useState<string[]>([]);
  const [selectPhoneNumber, setSelectPhoneNumber] = useState<string[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>();
  const axios = useAxios();

  const getReports = async () => {
    requestUsersReport(includeUsers, selectUserName, selectEmail, selectPhoneNumber, axios);
  };

  const showDrawer1 = () => {
    setOpen1(true);
  };

  const onClose1 = () => {
    setOpen1(false);
  };

  const onClose = () => {
    setIsEditUserOpen(false);
  };

  const getUsers = async () => {
    try {
      const res = await getAllUsers(axios);
      setRows(res.users);
    } catch (err: unknown) {
      console.error(err);
    }
  };

  React.useEffect(() => {
    getUsers();
  }, []);

  const handleRowEditStop: GridEventListener<"rowEditStop"> = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id: GridRowId) => () => {
    const user = rows.find((row) => row.id === id);
    if (user) {
      setSelectedUser(user);
      setIsEditUserOpen(true);
    }
  };

  const handleDeleteClick = (id: GridRowId) => () => {
    const user = rows.find((row) => row.id === id);
    if (user) {
      setSelectedUser(user);
      setIsDeleteUserOpen(true);
    }
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const [form] = Form.useForm();

  const handleDeleteUser = async () => {
    if (selectedUser) {
      await DeleteUsers(selectedUser.id, axios);
      getUsers();
      setIsDeleteUserOpen(false);
    }
  };

  const handleSearchClick = (id: GridRowId) => {
    navigate(`/tasks/user/${id}`);
  };

  const columns: GridColDef[] = [
    { field: "name", headerName: "Name", width: 180, editable: false },
    { field: "lastname", headerName: "Last Name", width: 180, editable: false },
    { field: "pesel", headerName: "Pesel", width: 180, editable: false },
    { field: "email", headerName: "Email", width: 180, flex: 1, editable: false },
    { field: "phoneNumber", headerName: "Phone Number", width: 180, editable: false },
    { field: "roles", headerName: "User Role", width: 180, editable: false },
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
          onClick={handleDeleteClick(id)}
          color="inherit"
        />,
        <GridActionsCellItem
          icon={<SearchIcon />}
          label="Show Tasks"
          onClick={() => handleSearchClick(id)}
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
            <Breadcrumb.Item>
              <Link to="/home" style={{ textDecoration: "none" }}>
                Dashboard
              </Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link to="/users" style={{ textDecoration: "none" }}>
                Manage Users
              </Link>
            </Breadcrumb.Item>
          </Breadcrumb>

          <Drawer
            title="Edit a User"
            width={720}
            onClose={onClose}
            open={isEditUserOpen}
            bodyStyle={{ paddingBottom: 80 }}
            extra={
              <Space>
                <Button onClick={onClose}>Cancel</Button>
              </Space>
            }
          >
            <UserForm form={form} initialValues={selectedUser} refreshUsers={getUsers} onClose={onClose} />
          </Drawer>

          <div className="container">
            <button className="button-gradient" style={{ marginRight: "auto" }}>
              <Link to="/users-with-role-user" style={{ textDecoration: "none", color: "black" }}>
                Show users with no roles
              </Link>
            </button>
            <button className="button-gradient" onClick={showDrawer1} style={{ marginRight: "10px" }}>
              Create Report
            </button>
          </div>

          <Drawer
            title="Create a new Report"
            width={720}
            onClose={onClose1}
            open={open1}
            bodyStyle={{ paddingBottom: 80 }}
            extra={
              <Space>
                <Button onClick={onClose1}>Cancel</Button>
                <Button onClick={getReports} type="primary">
                  Submit
                </Button>
              </Space>
            }
          >
            <UserReportForm
              includeUsers={includeUsers}
              setIncludeUsers={setIncludeUsers}
              selectUserName={selectUserName}
              setSelectUserName={setSelectUserName}
              selectEmail={selectEmail}
              setSelectEmail={setSelectEmail}
              selectPhoneNumber={selectPhoneNumber}
              setSelectPhoneNumber={setSelectPhoneNumber}
              rows={rows}
            />
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
              },
            }}
          />
        </Box>
      </Box>

      <Modal open={isDeleteUserOpen} onClose={() => setIsDeleteUserOpen(false)}>
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
              Delete User
            </Typography>
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              <Typography variant="h6" component="div">
                Are you sure you want to delete the user?
              </Typography>
              {selectedUser && (
                <p>
                  Username: {selectedUser.username} <br />
                  Email: {selectedUser.email}
                </p>
              )}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsDeleteUserOpen(false)}>Cancel</Button>
            <Button onClick={handleDeleteUser} color="error">
              Confirm
            </Button>
          </DialogActions>
        </Box>
      </Modal>
    </>
  );
};
