import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import UserDto from './dto/user.dto';
import * as bcrypt from 'bcryptjs';


@Injectable()
export class UserService {
    constructor(@InjectModel('User') private readonly userModel: Model<UserDto>) { }

    async getAll() {
        return await this.userModel.find().exec();
    }

    async getById(id: string) {
        return await this.userModel.findById(id).exec();
    }

    async getByNickname(nickname: string) {
        const response = await this.userModel.findOne({ nickname })
        return response;
    }

    async create(user: UserDto) {

        const hashedPassword = await bcrypt.hash(user.password, 10);
        const createdUser = new this.userModel({ ...user, password: hashedPassword });
        return await createdUser.save();
    }
}
