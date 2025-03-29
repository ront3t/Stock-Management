import { Request } from 'express';

export interface RequestWithUser extends Request {
  user: any; // Replace 'any' with your user type if available
}