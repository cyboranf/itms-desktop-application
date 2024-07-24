  import React, { useState, useEffect } from "react";
  import { Form, Input, Button, Row, Col, Select } from "antd";
  import { FormInstance } from "antd/es/form";
  import { User, Role } from "../../../service/users/types"; // Import Role instead of Roles
  import { PutUsers, getRoles, putRoles } from "../../../service/users";
  import { useAxios } from "../../../helpers/axios/useAxios";
  import { toast } from "react-toastify";

  const { Option } = Select;

  interface UserFormProps {
    form: FormInstance;
    initialValues?: User | null;
    refreshUsers: () => void;
    onClose: () => void; // Add onClose prop
  }

  const UserForm: React.FC<UserFormProps> = ({ form, initialValues, refreshUsers, onClose }) => { // Include onClose prop
    const [roles, setRoles] = useState<Role[]>([]);
    const [user, setUser] = useState<User>({
      id: 0,
      username: "",
      name: "",
      lastname: "",
      pesel: "",
      email: "",
      phoneNumber: "",
      roles: "",
    });
    const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);

    const axios = useAxios();

    useEffect(() => {
      if (initialValues) {
        setUser(initialValues);
        form.setFieldsValue(initialValues);
        setSelectedRoleId(Number(initialValues.roles));
      }

      const fetchRoles = async () => {
        try {
          const response = await getRoles(axios);
          setRoles(response);
        } catch (error) {
          console.error("Błąd podczas pobierania ról:", error);
        }
      };

      fetchRoles();
    }, [initialValues, form]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setUser({ ...user, [name]: value });
    };

    const handleRoleChange = (value: number) => {
      setSelectedRoleId(value);
      setUser({ ...user, roles: value.toString() });
    };

    const handleSubmit = async () => {
      try {
        await form.validateFields();
        const succ = await PutUsers(user, axios);
        const selectedRole = roles.find((role) => role.id === selectedRoleId);
        console.log(selectedRole?.name);
        await putRoles(user.id, selectedRole?.name || "User", axios);

        if (succ) {
          toast.success("Success");
          refreshUsers();
          onClose(); // Close the drawer after successful submission
        } else {
          toast.error("Error");
        }

      } catch (err) {
        console.error("Error during form submission:", err);
      }
    };

    return (
      <Form layout="vertical" hideRequiredMark form={form}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="email" label="Email" rules={[{ required: true, message: "Please enter email" }]}>
              <Input name="email" placeholder="Please enter email" value={user.email} onChange={handleInputChange} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="lastname" label="Last Name" rules={[{ required: true, message: "Please enter last name" }]}>
              <Input
                name="lastname"
                placeholder="Please enter last name"
                value={user.lastname}
                onChange={handleInputChange}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="name" label="Name" rules={[{ required: true, message: "Please enter name" }]}>
              <Input name="name" placeholder="Please enter name" value={user.name} onChange={handleInputChange} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="pesel" label="Pesel" rules={[{ required: true, message: "Please enter pesel" }]}>
              <Input name="pesel" placeholder="Please enter pesel" value={user.pesel} onChange={handleInputChange} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="phoneNumber"
              label="Phone Number"
              rules={[{ required: true, message: "Please enter phone number" }]}
            >
              <Input
                name="phoneNumber"
                placeholder="Please enter phone number"
                value={user.phoneNumber}
                onChange={handleInputChange}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="username" label="Username" rules={[{ required: true, message: "Please enter username" }]}>
              <Input name="username" placeholder="Please enter username" value={user.username} onChange={handleInputChange} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="role" label="Roles" rules={[{ required: true, message: "Please select a role" }]}>
              <Select
                showSearch
                placeholder="Select a role"
                optionFilterProp="children"
                onChange={handleRoleChange}
                value={selectedRoleId} // Use selectedRoleId for Select component
                filterOption={(input, option) =>
                  (option?.children as unknown as string).toLowerCase().includes(input.toLowerCase())
                }
              >
                {roles.map((role) => (
                  <Option key={role.id} value={role.id}>
                    {role.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item>
              <Button type="primary" onClick={handleSubmit} block>
                Submit
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  };

  export default UserForm;
