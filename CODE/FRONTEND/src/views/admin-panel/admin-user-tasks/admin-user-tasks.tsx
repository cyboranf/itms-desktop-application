import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import { Breadcrumb } from "antd";
import { getTasks } from "../../../service/users";
import { useAxios } from "../../../helpers/axios/useAxios";
import { Task } from "../../../service/tasks/types";
import { Link } from "react-router-dom";

const UserTasks: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [tasks, setTasks] = useState<Task[]>([]);
  const axios = useAxios();

  useEffect(() => {
    const fetchTasks = async () => {
      if (id) {
        try {
          const res = await getTasks(axios, id);
          setTasks(res);
        } catch (err: unknown) {
          console.error(err);
        }
      }
    };
    fetchTasks();
  }, [id]);

  const columns: GridColDef[] = [
    { field: "name", headerName: "Name", width: 300, editable: false },
    { field: "description", headerName: "Description", width: 300, editable: false },
    { field: "startDate", headerName: "Start Date", width: 180, editable: false },
    { field: "endDate", headerName: "End Date", width: 180, editable: false },
    { field: "state", headerName: "State", width: 120, editable: false },
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
          <Breadcrumb.Item>User Tasks</Breadcrumb.Item>
        </Breadcrumb>
        <DataGrid rows={tasks} columns={columns} style={{ flex: 1, minHeight: 0, width: "100%" }}
          sx={{
            "& .MuiDataGrid-footerContainer ": {
              bgcolor: "#b3d5e0",
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default UserTasks;
