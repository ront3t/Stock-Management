import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Base, BaseDocument } from '../common/schemas/base.schema'
;

export type StockDocument = Stock & BaseDocument;

@Schema({ timestamps: true })
export class Stock extends Base {
  @Prop({ required: true })
  ticker: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  user: Types.ObjectId;
}

export const StockSchema = SchemaFactory.createForClass(Stock);
