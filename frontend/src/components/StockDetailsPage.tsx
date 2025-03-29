import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../services/api';
import { Card, Spin } from 'antd';

interface StockDetails {
  ticker: string;
  price: number;
  previousClose: number;
  percentageChange: number;
  [key: string]: any;
}

const StockDetailsPage = () => {
  const { ticker } = useParams<{ ticker: string }>();
  const [stock, setStock] = useState<StockDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStock = async () => {
      try {
        const response = await API.get(`/stocks/${ticker}`);
        setStock(response.data);
      } catch (error) {
        console.error('Error fetching stock details', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStock();
  }, [ticker]);

  if (loading) return <Spin />;
  if (!stock) return <div>No data available</div>;

  return (
    <Card title={`Stock Details: ${ticker}`}>
      <p>Price: ${stock.price.toFixed(2)}</p>
      <p>Previous Close: ${stock.previousClose.toFixed(2)}</p>
      <p>Percentage Change Today: {stock.percentageChange.toFixed(2)}%</p>
      {/* Additional analytics can be displayed here */}
    </Card>
  );
};

export default StockDetailsPage;
