import { Injectable, NotFoundException } from '@nestjs/common';
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
    try {
      const newMessage = new this.messagesModel(createMessageDto);
      const savedMessage = await newMessage.save();
      return { id: savedMessage._id };
    } catch (error) {
      throw new Error(`Error creating room: ${error.message}`);
    }
  }

  async update(id: string, updateMessageDto: UpdateMessageDto) {
    const updatedMessage = await this.messagesModel
      .findByIdAndUpdate(id, updateMessageDto, { new: true })
      .exec();

    if (!updatedMessage) {
      throw new NotFoundException(`Mensagem não foi encontrada`);
    }

    return updatedMessage;
  }

  async remove(id: string) {
    const deletedMessage = await this.messagesModel
      .findByIdAndDelete(id)
      .exec();

    if (!deletedMessage) {
      throw new NotFoundException(`Mensagem não foi encontrada`);
    }

    return { message: `Mensagem deletada` };
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
