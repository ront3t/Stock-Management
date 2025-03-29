import { Schema } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type BaseDocument = Base & Document;

@Schema({ timestamps: true })
export class Base {
  _id: Types.ObjectId;

  createdAt: Date;

  updatedAt: Date;
} 