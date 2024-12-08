import { Prop } from '@nestjs/mongoose';
import {Document} from 'mongoose'

export default class UserDto extends Document {
    @Prop({ required: true, unique: true })
    nickname: string;
    @Prop({ required: true })
    email: string;
    @Prop({ required: true })
    password: string;
}