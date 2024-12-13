import { Injectable } from '@nestjs/common';
import { RoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class RoomsService {
  constructor(
    @InjectModel('Rooms') private readonly roomsModel: Model<RoomDto>,
  ) {}

  async create(createRoomDto: RoomDto) {
    try {
      const newRoom = new this.roomsModel(createRoomDto);
      return await newRoom.save();
    } catch (error) {
      throw new Error(`Erro para criar sala: ${error.message}`);
    }
  }

  async findAll() {
    try {
      return await this.roomsModel.find().exec();
    } catch (error) {
      throw new Error(`Erro: ${error.message}`);
    }
  }

  async findOne(id: string) {
    try {
      const room = await this.roomsModel.findById(id).exec();
      if (!room) {
        throw new Error(`Sala não encontrada`);
      }
      return room;
    } catch (error) {
      throw new Error(`Sala não encontrada: ${error.message}`);
    }
  }

  async update(id: string, updateRoomDto: UpdateRoomDto) {
    try {
      const updatedRoom = await this.roomsModel
        .findByIdAndUpdate(id, updateRoomDto, {
          new: true,
          runValidators: true,
        })
        .exec();
      if (!updatedRoom) {
        throw new Error(`Sala não encontrada`);
      }
      return updatedRoom;
    } catch (error) {
      throw new Error(`Erro ao atualizar: ${error.message}`);
    }
  }

  async remove(id: string) {
    try {
      const deletedRoom = await this.roomsModel.findByIdAndDelete(id).exec();
      if (!deletedRoom) {
        throw new Error(`Sala não encontrada`);
      }
      return { message: `Sala deletada` };
    } catch (error) {
      throw new Error(`Erro ao deletar: ${error.message}`);
    }
  }
}
