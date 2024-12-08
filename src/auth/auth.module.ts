import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UserSchema } from 'src/user/schemas/user.schema';
import { UserService } from 'src/user/user.service';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';

@Module({
  providers: [AuthService, UserService, JwtStrategy],
  imports:[MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
  PassportModule,
  JwtModule.register({
    secret: 'bvkhgfgxjvkbhjfx', 
    signOptions: { expiresIn: '1h' },
  }),],
  controllers: [AuthController], 
  exports: [AuthService],
})
export class AuthModule {}
