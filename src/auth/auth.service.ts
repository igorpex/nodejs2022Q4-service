import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { LoginUserDto } from './dto/login-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private readonly usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  async signup(createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  createTokens(payload) {
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET_KEY'),
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET_REFRESH_KEY'),
    });
    return { accessToken, refreshToken };
  }

  async login(loginUserDto: LoginUserDto) {
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
    const payload = { userId: user.id, login: user.login };
    const tokens = this.createTokens(payload);
    return tokens;
  }

  private verifyRefreshToken(refreshToken: string) {
    console.log('refreshToken', refreshToken);
    try {
      const verify = this.jwtService.verify(refreshToken, {
        secret: this.configService.get('JWT_SECRET_REFRESH_KEY'),
      });
      return verify;
    } catch (error) {}
  }

  async refresh(refreshTokenDto: RefreshTokenDto) {
    const decryptedToken = this.verifyRefreshToken(
      refreshTokenDto.refreshToken,
    );
    if (!decryptedToken) {
      throw new ForbiddenException('Wrong token');
    } //403

    const userId = decryptedToken.userId;
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new ForbiddenException(`Wrong user`);
    } //403
    const payload = { userId: user.id, login: user.login };
    const tokens = this.createTokens(payload);
    return tokens;
  }
}
