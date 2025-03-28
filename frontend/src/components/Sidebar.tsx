import React from 'react';
import { Layout, Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { authStore } from '../stores/AuthStore';

const { Sider } = Layout;

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleMenuClick = ({ key }: { key: string }) => {
    if (key === 'logout') {
      authStore.logout();
      navigate('/login');
    } else {
      navigate(key);
    }
  };

  return (
    <Sider>
      <Menu theme="dark" mode="inline" selectedKeys={[location.pathname]} onClick={handleMenuClick}>
        <Menu.Item key="/portfolio">Portfolio</Menu.Item>
        <Menu.Item key="/analytics">Analytics</Menu.Item>
        <Menu.Item key="logout">Logout</Menu.Item>
      </Menu>
    </Sider>
  );
};

export default Sidebar;
