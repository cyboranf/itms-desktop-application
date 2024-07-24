import "./navbar.scss";
import { useState } from "react";
import {
	TableOutlined,
	HomeOutlined,
	SettingOutlined,
	LogoutOutlined,
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
import { Link } from "react-router-dom";
const { Sider } = Layout;

export const NavbarManager = () => {
	const [collapsed, setCollapsed] = useState(true);

	return (
		<Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
			<div className='demo-logo-vertical' style={{ textAlign: "center", marginBottom: "20px" }}>
				<img src='src\assets\human-logo.webp' style={{ width: "50px" }} />
			</div>
			<Menu theme='dark' defaultSelectedKeys={["1"]} mode='inline'>
				<Menu.Item key='home' icon={<HomeOutlined />}>
					<Link to='/manager/home'>
						<span className='nav-text'>Home</span>
					</Link>
				</Menu.Item>
				<Menu.Item key='Tasks' icon={<TableOutlined />}>
					<Link to='/manager/tasks'>
						<span className='nav-text'>Tasks</span>
					</Link>
				</Menu.Item>
				<Menu.Item key='Seting' icon={<SettingOutlined />}>
					<Link to='/manager/settings'>
						<span className='nav-text'>Settings</span>
					</Link>
				</Menu.Item>
				<Menu.Item key='Logout' icon={<LogoutOutlined />}>
					<Link to='/logout'>
						<span className='nav-text'>Logout</span>
					</Link>
				</Menu.Item>
			</Menu>
		</Sider>
	);
};
