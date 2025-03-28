import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from 'antd';
import Sidebar from './components/Sidebar';
import LoginPage from './components/LoginPage';
import PortfolioPage from './components/PortfolioPage';
import StockDetailsPage from './components/StockDetailsPage';
import { observer } from 'mobx-react-lite';
import { authStore } from './stores/AuthStore';
import RegisterPage from './components/RegisterPage';

const { Content } = Layout;

const App: React.FC = observer(() => {
  return (
    <BrowserRouter>
      {!authStore.isAuthenticated ? (
        <Routes>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      ) : (
        <Layout style={{ minHeight: '100vh' }}>
          <Sidebar />
          <Layout>
            <Content style={{ margin: '24px 16px 0' }}>
              <Routes>
                <Route path="/portfolio" element={<PortfolioPage />} />
                <Route path="/stocks/:ticker" element={<StockDetailsPage />} />
                <Route path="*" element={<Navigate to="/portfolio" replace />} />
              </Routes>
            </Content>
          </Layout>
        </Layout>
      )}
    </BrowserRouter>
  );
});

export default App;
