import {Document} from 'mongoose'

export default class UserDto extends Document {
    nickname: string;
    email: string;
    password: string;
}