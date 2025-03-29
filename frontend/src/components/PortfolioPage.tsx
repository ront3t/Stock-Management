// apps/frontend/src/components/PortfolioPage.tsx
import { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { portfolioStore } from '../stores/PortfolioStore';
import { authStore } from '../stores/AuthStore';
import { Input, Button, List, Row, Col, Typography } from 'antd';

const { Title } = Typography;

const PortfolioPage = observer(() => {
  const [newTicker, setNewTicker] = useState('');

  useEffect(() => {
    console.log('')
    portfolioStore.fetchPortfolio();
  }, []);

  const addStock = async () => {
    if (newTicker.trim()) {
      await portfolioStore.addStock(newTicker.toUpperCase());
      setNewTicker('');
    }
  };

  const removeStock = async (ticker: string) => {
    await portfolioStore.removeStock(ticker);
  };

  return (
    <div style={{ padding: '20px' }}>
      {/* Personalized greeting */}
      <Title level={3}>Hey {authStore.username || 'User'}, your stock portfolio:</Title>
      
      <Row gutter={[16, 16]}>
        {/* Search input to add new stocks */}
        <Col xs={24} md={12}>
          <Input.Search 
            placeholder="Enter stock ticker" 
            enterButton="Add" 
            value={newTicker} 
            onChange={(e) => setNewTicker(e.target.value)} 
            onSearch={addStock}
          />
        </Col>
        {/* List of user's stocks with remove button */}
        <Col xs={24} md={12}>
          <List
            header={<div>Your Stocks</div>}
            bordered
            dataSource={portfolioStore.stocks}
            renderItem={(ticker: string) => (
              <List.Item
                actions={[
                  <Button danger onClick={() => removeStock(ticker)}>Remove</Button>
                ]}
              >
                {ticker}
              </List.Item>
            )}
          />
        </Col>
      </Row>
    </div>
  );
});

export default PortfolioPage;
