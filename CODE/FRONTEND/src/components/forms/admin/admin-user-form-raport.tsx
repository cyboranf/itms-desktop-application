// src/components/forms/admin/UserReportForm.tsx

import React from "react";
import { Form, Select, Switch, Row } from "antd";
import { User } from "../../../service/users/types";

interface UserReportFormProps {
  includeUsers: boolean;
  setIncludeUsers: (value: boolean) => void;
  selectUserName: string[];
  setSelectUserName: (value: string[]) => void;
  selectEmail: string[];
  setSelectEmail: (value: string[]) => void;
  selectPhoneNumber: string[];
  setSelectPhoneNumber: (value: string[]) => void;
  rows: User[];
}

const UserReportForm: React.FC<UserReportFormProps> = ({
  includeUsers,
  setIncludeUsers,
  selectUserName,
  setSelectUserName,
  selectEmail,
  setSelectEmail,
  selectPhoneNumber,
  setSelectPhoneNumber,
  rows,
}) => {
  return (
    <Form layout="vertical">
      <Row>
        <Form.Item label="Include Tasks" name="includeUsers" valuePropName="checked">
          <Switch checked={includeUsers} onChange={setIncludeUsers} />
        </Form.Item>
      </Row>

      <Form.Item label="Username" name="username" rules={[{ required: false, message: "Please select username" }]}>
        <Select value={selectUserName} onChange={setSelectUserName}>
          {rows.map((row) => (
            <Select.Option key={row.username} value={row.username}>
              {row.username}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label="Email" name="email" rules={[{ required: false, message: "Please select email" }]}>
        <Select value={selectEmail} onChange={setSelectEmail}>
          {rows.map((row) => (
            <Select.Option key={row.email} value={row.email}>
              {row.email}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label="Phone Number" name="phoneNumber" rules={[{ required: false, message: "Please select Phone Number" }]}>
        <Select value={selectPhoneNumber} onChange={setSelectPhoneNumber}>
          {rows.map((row) => (
            <Select.Option key={row.phoneNumber} value={row.phoneNumber}>
              {row.phoneNumber}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
    </Form>
  );
};

export default UserReportForm;
