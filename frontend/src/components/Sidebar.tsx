import React from 'react';
import { Layout, Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { authStore } from '../stores/AuthStore';

const { Sider } = Layout;

const menuItems = [
  { key: '/portfolio', label: 'Portfolio' },
  { key: '/analytics', label: 'Analytics' },
  { key: 'logout', label: 'Logout' },
];

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleMenuClick = ({ key }: { key: string }) => {
    if(key === '/analytics'){
      window.alert('to be continued...')
    }
    else if(key === 'logout') {
      authStore.logout();
      navigate('/login');
    } else {
      navigate(key);
    }
  };

  return (
    <Sider>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={handleMenuClick}
      />
    </Sider>
  );
};

export default Sidebar;
