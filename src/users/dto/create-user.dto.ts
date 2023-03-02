import { IsString } from 'class-validator';

// export interface CreateUserDto {
export class CreateUserDto {
  @IsString()
  login: string;

  @IsString()
  password: string;
}
