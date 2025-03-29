import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findByUsername(username);
    if (user && await bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user.toObject();
      return result;
    }
    return null;
  }

  async login(user: any): Promise<{ access_token: string }> {
    const payload = { 
      userId: user._id.toString(),
      username: user.username 
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(userData: { username: string; email: string; password: string }) {
    return this.usersService.create(userData);
  }

  async logout(user: any) {
    await this.usersService.updateRefreshToken(user._id, null);
    return { message: 'Logged out successfully' };
  }
}

