// apps/frontend/src/components/PortfolioPage.tsx
import { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { portfolioStore } from '../stores/PortfolioStore';
import { Input, Button, List } from 'antd';
import { useNavigate } from 'react-router-dom';

const PortfolioPage = observer(() => {
  const [newTicker, setNewTicker] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    portfolioStore.fetchPortfolio();
  }, []);

  const addStock = async () => {
    if (newTicker) {
      await portfolioStore.addStock(newTicker.toUpperCase());
      setNewTicker('');
    }
  };

  const removeStock = async (ticker: string) => {
    await portfolioStore.removeStock(ticker);
  };

  const viewDetails = (ticker: string) => {
    navigate(`/stocks/${ticker}`);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Your Portfolio</h2>
      <Input.Search 
        placeholder="Enter stock ticker" 
        enterButton="Add" 
        value={newTicker} 
        onChange={(e) => setNewTicker(e.target.value)} 
        onSearch={addStock}
      />
      <List
        dataSource={portfolioStore.stocks}
        renderItem={(ticker: string) => (
          <List.Item
            actions={[
              <Button onClick={() => viewDetails(ticker)}>View</Button>,
              <Button danger onClick={() => removeStock(ticker)}>Remove</Button>
            ]}
          >
            {ticker}
          </List.Item>
        )}
      />
    </div>
  );
});

export default PortfolioPage;
