import { HttpException, HttpStatus } from '@nestjs/common';

export class StockException extends HttpException {
  constructor(message: string, status: HttpStatus) {
    super(
      {
        status,
        error: message,
        timestamp: new Date().toISOString(),
      },
      status
    );
  }
}

export class StockAlreadyExistsException extends HttpException {
  constructor(message: string = 'Stock already exists in portfolio') {
    super(message, HttpStatus.BAD_REQUEST);
  }
}

export class StockNotFoundException extends HttpException {
    constructor(message: string = 'Stock not found') {
      super(message, HttpStatus.NOT_FOUND);
    }
  }

export class ExternalApiException extends HttpException {
  constructor(message: string = 'Error communicating with external API') {
    super(message, HttpStatus.BAD_GATEWAY);
  }
} 