import { BaseDto } from '../common/dto/base.dto';

export interface StockQuoteResponse {
  symbol: string;
  name: string;
  price: number;
  previousClose: number;
  percentageChange: number;
  volume: number;
  marketCap: number;
}

export class StockDto extends BaseDto {
  ticker: string;
  userId: string;
}

export interface TickerSearchResponse {
  symbol: string;
  name: string;
  exchange: string;
} 