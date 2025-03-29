import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import { StockException } from '../exceptions/stock.exceptions';

@Catch(StockException)
export class StockExceptionsFilter implements ExceptionFilter {
  catch(exception: StockException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    response
      .status(status)
      .json(exception.getResponse());
  }
} 