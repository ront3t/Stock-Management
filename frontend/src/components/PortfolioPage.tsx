// apps/frontend/src/components/PortfolioPage.tsx
import { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { portfolioStore } from '../stores/PortfolioStore';
import { authStore } from '../stores/AuthStore';
import { Input, Button, List, Row, Col, Typography, message } from 'antd';
import API from '../services/api';

const { Title } = Typography;

const PortfolioPage = observer(() => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  useEffect(() => {
    portfolioStore.fetchPortfolio();
  }, []);

  // Call the backend to search for stocks
  const handleSearch = async (value: string) => {
    if (value.trim()) {
      try {
        const response = await API.get('/stocks/search', {
          params: { query: value },
        });
        setSearchResults(response.data);
      } catch (error) {
        console.error('Error searching stocks', error);
        message.error('Error searching stocks');
      }
    }
  };

  const handleAddStock = async (ticker: string) => {
    try {
      await portfolioStore.addStock(ticker);
      message.success(`Stock ${ticker} added to your portfolio`);
      setSearchResults([]); // Clear search results
      portfolioStore.fetchPortfolio(); // Refresh portfolio list
    } catch (error) {
      console.error('Failed to add stock', error);
      message.error(`Failed to add stock ${ticker}`);
    }
  };

  const handleRemoveStock = async (stockId: string) => {
    try {
      await portfolioStore.removeStock(stockId);
      message.success('Stock removed from your portfolio');
      portfolioStore.fetchPortfolio();
    } catch (error) {
      console.error('Failed to remove stock', error);
      message.error('Failed to remove stock');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      {/* Personalized greeting */}
      <Title level={3}>
        Hey {authStore.username || 'User'}, your stock portfolio:
      </Title>

      <Row gutter={[16, 16]}>
        {/* Stock Search Input */}
        <Col xs={24} md={12}>
          <Input.Search
            placeholder="Search for stocks"
            enterButton="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onSearch={handleSearch}
          />
        </Col>
      </Row>

      {/* Display search results */}
      {searchResults.length > 0 && (
        <Row style={{ marginTop: '20px' }}>
          <Col span={24}>
            <List
              header={<div>Search Results</div>}
              bordered
              dataSource={searchResults}
              renderItem={(item: any) => (
                <List.Item
                  actions={[
                    <Button type="primary" onClick={() => handleAddStock(item.symbol)}>
                      Add
                    </Button>,
                  ]}
                >
                  <div>
                    <strong>{item.symbol}</strong> - {item.name}
                  </div>
                </List.Item>
              )}
            />
          </Col>
        </Row>
      )}

      {/* List of user's portfolio stocks */}
      <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
        <Col xs={24}>
          <List
            header={<div>Your Stocks</div>}
            bordered
            dataSource={portfolioStore.stocks}
            renderItem={(stock: any) => (
              <List.Item
                actions={[
                  <Button danger onClick={() => handleRemoveStock(stock.id)}>
                    Remove
                  </Button>,
                ]}
              >
                {stock.ticker}
              </List.Item>
            )}
          />
        </Col>
      </Row>
    </div>
  );
});

export default PortfolioPage;
