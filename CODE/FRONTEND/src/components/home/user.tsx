import { UnderlineOutlined } from '@ant-design/icons'
import { Card, List, Skeleton } from 'antd'
import { Text } from '../text'
import { useAxios } from '../../helpers/axios/useAxios';
import { getAllUsers } from "../../service/users";
import { User } from "../../service/users/types";
import * as React from "react";

const Dashboarduser = () => {

  const isLoading = false;


  const axios = useAxios();
  const [users, setUsers] = React.useState<User[]>([]);

  const getUsers = async () => {
    try {
      const user = await getAllUsers(axios);
      setUsers(user.users.slice(0, 5));

    } catch (err: unknown) {
      console.log(err);
    }
  };

  React.useEffect(() => {
    getUsers();
  }, []);


  return (
    <Card headStyle={{ padding: '16px' }} bodyStyle={{ padding: '0 1rem' }} title={(
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '6px' }}><UnderlineOutlined /> <Text
        size='md' style={{ marginLeft: '0.5rem' }}>Working Users</Text>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '730px' }}><UnderlineOutlined /> <Text
          size='md' style={{ marginLeft: '0.5rem' }}>Roles</Text></div>
      </div>
    )}>
      {isLoading ? (
        <List
          itemLayout='horizontal'
          dataSource={Array.from({ length: 4 }).map((_, i) => ({ id: i }))}
          renderItem={(_) => (
            <Skeleton active />
          )}
        />
      ) : (
        <List
          itemLayout='horizontal'
          dataSource={users}
          renderItem={(user) => (
            <List.Item>
              <List.Item.Meta
                title={<Text>{user.name} {user.roles}</Text>}

              />
              <List.Item.Meta
                title={<Text>{user.roles}</Text>}

              />
            </List.Item>
          )}
        />
      )}
    </Card>
  )
}

export default Dashboarduser