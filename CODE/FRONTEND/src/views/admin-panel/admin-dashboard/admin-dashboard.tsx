import { Col, Row } from "antd";
import * as React from "react";
import {
  Dashboarduser,
  DashbordTotalCountCard,
  Products,
  Tasks,
} from "../../../components/home";
import { useAxios } from '../../../helpers/axios/useAxios';
import { getAllTasks } from "../../../service/tasks";
import { getAllUsers } from "../../../service/users";
import { getAllItems } from "../../../service/items";

export const Admindashboard = () => {


  const axios = useAxios();
  const [tasks, setTasksCount] = React.useState<number>(0);
  const [users, setUsersCount] = React.useState<number>(0);
  const [products, setProductCount] = React.useState<number>(0);

  const getTasks = async () => {
    try {
      const task = await getAllTasks(axios);
      const user = await getAllUsers(axios);
      const items = await getAllItems(axios);
      setTasksCount(task.totalCount);
      setUsersCount(user.totalCount);
      setProductCount(items.totalCount);
    } catch (err: unknown) {
      console.log(err);
    }
  };

  React.useEffect(() => {
    getTasks();
  }, []);

  const [isLoading] = React.useState(false)

  return (
    <div>
      <Row gutter={[32, 32]} style={{
        paddingTop: '20px'
      }}>
        <Col xs={24} sm={24} xl={8} >
          <DashbordTotalCountCard resource="task" isLoading={isLoading} totalCount={tasks} />
        </Col>
        <Col xs={24} sm={24} xl={8}>
          <DashbordTotalCountCard resource="user" isLoading={isLoading} totalCount={users} />
        </Col>
        <Col xs={24} sm={24} xl={8}>
          <DashbordTotalCountCard resource="product" isLoading={isLoading} totalCount={products} />
        </Col>
      </Row>

      <Row
        gutter={[32, 32]}
        style={{
          marginTop: "32px",
        }}
      ></Row>

      <Row
        gutter={[32, 32]}
        style={{
          marginTop: "32px",
        }}
      >
        <Col
          xs={24}
          sm={24}
          xl={8}
          style={{
            height: "460px",
          }}
        >
          <Tasks />
        </Col>

        <Col
          xs={24}
          sm={24}
          xl={16}
          style={{
            height: "460px",
          }}
        >
          <Products />
        </Col>
      </Row>

      <Row gutter={[32, 32]} style={{ marginTop: '32px' }}>
        <Col xs={24}>
          <Dashboarduser />
        </Col>
      </Row>

    </div>
  );
};

export default Admindashboard;
