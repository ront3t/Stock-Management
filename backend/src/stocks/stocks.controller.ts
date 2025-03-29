import { Controller, Get, Post, Delete, Param, Body, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { StocksService } from './stocks.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('stocks')
@UseGuards(JwtAuthGuard)
export class StocksController {
  constructor(private readonly stocksService: StocksService) {}

  @Get('portfolio')
  async getPortfolio(@Request() req) {
    return this.stocksService.getPortfolio(req.user.userId);
  }

  @Post('portfolio')
  async addStock(@Request() req, @Body('ticker') ticker: string) {
    return this.stocksService.addStock(req.user.userId, ticker.toUpperCase());
  }

  @Delete('portfolio/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeStock(@Request() req, @Param('id') id: string) {
    return this.stocksService.removeStock(req.user.userId, id);
  }

  @Get(':ticker')
  async getStockQuote(@Param('ticker') ticker: string): Promise<any> {
    return this.stocksService.getStockQuote(ticker.toUpperCase());
  }
}
