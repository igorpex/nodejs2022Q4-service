import { IsString } from 'class-validator';

// export interface CreateUserDto {
export class LoginUserDto {
  @IsString()
  login: string;

  @IsString()
  password: string;
}
