import { Controller, Post, Body, Request, UseGuards, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import UserDto from 'src/user/dto/user.dto';
import { JwtAuthGuard } from './jwt-auth.guard';


@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UserService,
  ) {}

  @Post('register')
  async register(@Body() data: UserDto) {
    return this.usersService.create(data);
  }

  @Post('login')
  async login(@Body() body: { nickname: string; password: string }) {
    const user = await this.authService.validateUser(body.nickname, body.password);
    if (!user) throw new UnauthorizedException();
    return this.authService.login(user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
