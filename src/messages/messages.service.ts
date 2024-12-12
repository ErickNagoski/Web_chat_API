import { Injectable } from '@nestjs/common';
import { MessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel('Messages') private readonly messagesModel: Model<MessageDto>,
  ) {}

  async create(createMessageDto: MessageDto) {
    console.log('Creating message:', createMessageDto);
    try {
      const newRoom = new this.messagesModel(createMessageDto);
      return await newRoom.save();
    } catch (error) {
      throw new Error(`Error creating room: ${error.message}`);
    }
  }

  findAll() {
    return `This action returns all messages`;
  }

  findOne(id: number) {
    return `This action returns a #${id} message`;
  }

  update(id: number, updateMessageDto: UpdateMessageDto) {
    console.log(updateMessageDto);
    return `This action updates a #${id} message`;
  }

  remove(id: number) {
    return `This action removes a #${id} message`;
  }

  async getHistory(
    room: string,
    limit: number = 50,
    page: number = 1,
  ): Promise<MessageDto[]> {
    const skip = (page - 1) * limit;
    return await this.messagesModel
      .find({ room })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
  }
}
