import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { UserNotFoundException } from './exceptions/user.exceptions';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findByUsername(username: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ username });
    if (!user) {
      throw new UserNotFoundException(`User with username ${username} not found`);
    }
    return user;
  }

  async findById(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new UserNotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async create(userData: { username: string; email: string; password: string }): Promise<UserDocument> {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const createdUser = new this.userModel({
      ...userData,
      password: hashedPassword,
    });
    return createdUser.save();
  }

  async updateRefreshToken(id: string, refreshToken: string | null): Promise<UserDocument | null> {
    return this.userModel.findByIdAndUpdate(
      id,
      { refreshToken },
      { new: true }
    );
  }
}
