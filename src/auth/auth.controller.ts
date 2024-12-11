import {
  Controller,
  Post,
  Body,
  Request,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import UserDto from 'src/user/dto/user.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Public } from './public.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UserService,
  ) {}

  @Public()
  @Post('register')
  async register(@Body() data: UserDto) {
    return this.usersService.create(data);
  }

  @Public()
  @Post('login')
  async login(@Body() body: { nickname: string; password: string }) {
    const user = await this.authService.validateUser(
      body.nickname,
      body.password,
    );
    if (!user) throw new UnauthorizedException();
    return this.authService.login(user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('profile')
  async getProfile(@Request() req) {
    const userData = await this.usersService.getById(req.user.userId);
    return {
      id: userData._id,
      nickname: userData.nickname,
      email: userData.email,
    };
  }
}
