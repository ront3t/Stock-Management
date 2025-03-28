// apps/frontend/src/App.tsx
import React from 'react';
import { BrowserRouter, Route, Routes, Navigate} from 'react-router-dom';
import { Layout } from 'antd';
//import Sidebar from './components/Sidebar';
// import LoginPage from './components/LoginPage';
// import StockDetailsPage from './components/StockDetailsPage';
import { PortfolioPage } from './components/PortfolioPage';
import { observer } from 'mobx-react-lite';
import { authStore } from './stores/AuthStore';
import LoginPage from './components/LoginPage';

const { Content } = Layout;

const App: React.FC = observer(() => {

  return (
    <div>
      <Layout style={{ minHeight: '100vh' }}>
        {/* {authStore.isAuthenticated && <Sidebar />} */}
        <Layout>
        <Content style={{ margin: '24px 16px 0' }}>
           <BrowserRouter>
              <Routes>
                    <Route path ='/' element={ authStore.isAuthenticated? <PortfolioPage />: <Navigate to='/login'/>} />
                    <Route path ='/login' element={ !authStore.isAuthenticated? <LoginPage />: <Navigate to='/'/>}/>
              </Routes>
           </BrowserRouter>
          </Content>
        </Layout>
      </Layout>
    </div>
  );
});

export default App;
