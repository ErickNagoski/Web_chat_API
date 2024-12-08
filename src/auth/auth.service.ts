import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
    ) { }

    async validateUser(nickname: string, password: string): Promise<any> {
        const user = await this.userService.getByNickname(nickname);
        if (user && (await bcrypt.compare(password, user.password))) {
          const { password, ...result } = user.toObject();
          return result;
        }
        return null;
      }

    async login(user: any) {
        const payload = { nickname: user.nickname, sub: user._id };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}