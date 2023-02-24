import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
// import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtAuthGuard } from './guards/jwt-guard';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  async signup(createUserDto: CreateUserDto) {
    // createUserDto.password = await this.usersService.hashPassword(
    //   createUserDto.password,
    // );
    return await this.usersService.create(createUserDto);
  }

  async login(loginUserDto: LoginUserDto) {
    // createUserDto.password = await this.usersService.hashPassword(
    //   createUserDto.password,
    // );
    const user = await this.prisma.users.findFirst({
      where: {
        login: loginUserDto.login,
      },
    });
    if (!user) {
      throw new BadRequestException(`Not correct combination`);
    } //400
    const validatePassword = await bcrypt.compare(
      loginUserDto.password,
      user.password,
    );

    if (!validatePassword) {
      throw new ForbiddenException('Not correct combination'); //403
    }
    // console.log('user at login:', user);
    const payload = { userId: user.id, login: user.login };
    return { accessToken: this.jwtService.sign(payload) };
  }
}
