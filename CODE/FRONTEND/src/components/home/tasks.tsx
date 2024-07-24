import { CalendarOutlined } from "@ant-design/icons";
import * as React from "react";
import { Badge, Card, List, Skeleton } from "antd";
import { useState } from "react";
import { getAllTasks } from "../../service/tasks";
import { Task } from "../../service/tasks/types";
import { useAxios } from '../../helpers/axios/useAxios';
import { Text } from "../text";

const getStatusBadgeType = (status: number): 'success' | 'warning' | 'error' => {
  switch (status) {
    case 1:
      return 'success';
    case 2:
      return 'warning';
    case 3:
      return 'error';
    default:
      return 'error'; // Domyślna wartość
  }
};

function Tasks() {
  const axios = useAxios();
  const [tasks, setTasks] = React.useState<Task[]>([]);

  const getTasks = async () => {
    try {
      const taskResponse = await getAllTasks(axios);
      setTasks(taskResponse.tasks.slice(0, 5));
    } catch (err: unknown) {
      console.log(err);
    }
  };

  React.useEffect(() => {
    getTasks();
  }, []);

  const [isLoading,] = useState(false);
  return (
    <Card
      style={{ height: "100%" }}
      headStyle={{ padding: "8px 16px" }}
      bodyStyle={{ padding: "0 1rem" }}
      title={
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <CalendarOutlined />
          <Text size='md' style={{ marginLeft: "0.7rem" }}>
            Tasks
          </Text>
        </div>
      }
    >
      {isLoading ? (
        <List
          itemLayout='horizontal'
          dataSource={Array.from({ length: 2 }).map((_, index) => ({
            id: index,
          }))}
          renderItem={() => <Skeleton active />}
        ></List>
      ) : (
        <List
          itemLayout='horizontal'
          dataSource={tasks}
          renderItem={(item) => {
            return (
              <List.Item>
                <List.Item.Meta
                  avatar={<Badge status={getStatusBadgeType(item.priority)} />}
                  title={<Text>{new Date(item.creationDate).toISOString().split('T')[0]}</Text>}
                  description={
                    <Text ellipsis={{ tooltip: true }} strong>
                      {item.name}
                    </Text>
                  }
                />
              </List.Item>
            );
          }}
        ></List>
      )}
    </Card>
  );
}

export default Tasks;
