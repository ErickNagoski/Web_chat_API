import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserSchema } from './schemas/user.schema'
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])]
})
export class UserModule { }
