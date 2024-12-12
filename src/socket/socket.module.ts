import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { SocketService } from './socket.service';
import { MessagesModule } from 'src/messages/messages.module';

@Module({
  providers: [SocketGateway, SocketService],
  imports: [MessagesModule],
})
export class SocketModule {}
