import { Module } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { RoomsSchema } from './schema/rooms.schema';

@Module({
  controllers: [RoomsController],
  providers: [RoomsService],
  imports: [MongooseModule.forFeature([{ name: 'Rooms', schema: RoomsSchema }])]

})
export class RoomsModule {}
