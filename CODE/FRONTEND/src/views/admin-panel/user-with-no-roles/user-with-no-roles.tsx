import React, { useState } from "react";
import { DataGrid, GridColDef, GridActionsCellItem, GridRowId } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import { getUsersWithUserRole, DeleteUsers } from "../../../service/users";
import { useAxios } from "../../../helpers/axios/useAxios";
import { User } from "../../../service/users/types";
import { Breadcrumb, Button, Drawer, Space, Form } from "antd";
import { Link } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import { Modal, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";
import { Typography } from "@mui/material";
import UserForm from "../../../components/forms/admin/admin-users-form";


const UserRoleUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>();
  const [isDeleteUserOpen, setIsDeleteUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  

  const axios = useAxios();

  const onClose = () => {
    setIsEditUserOpen(false);
  };

  const handleDeleteClick = (id: GridRowId) => () => {
    const user = users.find((row) => row.id === id);
    if (user) {
      setSelectedUser(user);
      setIsDeleteUserOpen(true);
    }
  };

  const handleEditClick = (id: GridRowId) => () => {
    const user = users.find((row) => row.id === id);
    if (user) {
      setSelectedUser(user);
      setIsEditUserOpen(true);
    }
  };

  const getUsers = async () => {
    try {
      const res = await getUsersWithUserRole(axios);
      setUsers(res);
    } catch (err: unknown) {
      console.error(err);
    }
  };

  React.useEffect(() => {
    getUsers();
  }, []);

  const handleDeleteUser = async () => {
    if (selectedUser) {
      await DeleteUsers(selectedUser.id, axios);
      getUsers();
      setIsDeleteUserOpen(false);
    }
  };

  const [form] = Form.useForm();

  const columns: GridColDef[] = [
    { field: "username", headerName: "Username", width: 180, editable: false },
    { field: "name", headerName: "First Name", width: 180, editable: false },
    { field: "lastname", headerName: "Last Name", width: 180, editable: false },
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
          />
        ],
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
            <Breadcrumb.Item>
              <Link to="" style={{ textDecoration: "none" }}>
                    Show users with no roles
              </Link>
            </Breadcrumb.Item>
          </Breadcrumb>
      
      <DataGrid rows={users} columns={columns} />

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
            <UserForm form={form} initialValues={selectedUser} refreshUsers={getUsers} onClose={onClose}/>
          </Drawer>
      </Box>
    </Box>
  );
};

export default UserRoleUsers;
