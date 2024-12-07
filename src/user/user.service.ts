import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import UserDto from './dto/user.dto';

@Injectable()
export class UserService {
    constructor(@InjectModel('User') private readonly userModel: Model<UserDto>){ }

    async getAll(){
        return await this.userModel.find().exec();
    }

    async getById(id:string){
        return await this.userModel.findById(id).exec();
    }

    async create(user:UserDto){
        const createdUser = new this.userModel(user);
        return await createdUser.save();
    }
}
