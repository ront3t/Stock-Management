import { BaseDto } from '../../common/dto/base.dto';

export class UserDto extends BaseDto {
  username: string;
  email: string;    
}

export class CreateUserDto {
  username: string;
  email: string;
  password: string;
}

export class UpdateUserDto {
  username?: string;
  email?: string;
} 