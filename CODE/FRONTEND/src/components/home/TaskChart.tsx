import { DollarOutlined } from '@ant-design/icons';
import * as React from "react";
import { Card } from 'antd';
import { Text } from '../text';
import { Area, AreaConfig } from '@ant-design/plots';
import { useAxios } from '../../helpers/axios/useAxios';
import { getAllTasks } from "../../service/tasks";
import { Task } from "../../service/tasks/types";

function TaskChart() {
  const axios = useAxios();
  const [tasks, setTasks] = React.useState<Task[]>([]);

  const getTasks = async () => {
    try {
      const res = await getAllTasks(axios);
      setTasks(res.tasks);
    } catch (err: unknown) {
      console.log(err);
    }
  };

  React.useEffect(() => {
    getTasks();
  }, []);

  const groupByCreationDate = (tasks: Task[]) => {
    const groupedData: { date: string, value: number }[] = [];
    const taskMap: { [date: string]: number } = {};

    tasks.forEach(task => {
      const date = new Date(task.creationDate).toISOString().split('T')[0];
      if (!taskMap[date]) {
        taskMap[date] = 0;
      }
      taskMap[date]++;
    });

    for (const date in taskMap) {
      groupedData.push({ date, value: taskMap[date] });
    }

    return groupedData;
  };

  const config: AreaConfig = {
    data: groupByCreationDate(tasks),
    xField: 'date',
    yField: 'value',
    xAxis: {
      tickCount: 5,
    },
    yAxis: {
      min: 0,
    },
  };

  return (
    <Card
      style={{
        height: "100%",
      }}
      headStyle={{ padding: '8px 16px' }}
      bodyStyle={{ padding: '24px 24px 0 24px' }}
      title={
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <DollarOutlined />
          <Text size='md' style={{ marginLeft: '0.5rem' }}>
            Tasks
          </Text>
        </div>
      }
    >
      <Area
        {...config}
        height={325}
      />
    </Card>
  );
}

export default TaskChart;
