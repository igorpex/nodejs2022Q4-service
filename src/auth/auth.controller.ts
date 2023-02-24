import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.signup(createUserDto);
  }

  //   @Post('login')
  //   login(@Request() req) {
  //     return this.authService.login(req.user);
  //   }
//   @UseGuards(AuthGuard('local'))
  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }
}
