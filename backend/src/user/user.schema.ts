import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEmail } from 'class-validator';
import { Base, BaseDocument } from '../common/schemas/base.schema';

export type UserDocument = User & BaseDocument;

@Schema({ timestamps: true })
export class User extends Base {
  @Prop({ unique: true, required: true })
  username: string;

  @Prop({ unique: true, required: true })
  @IsEmail()
  email: string;

  @Prop({ required: true })
  password: string; // hashed password

  @Prop({ default: null })
  refreshToken: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
