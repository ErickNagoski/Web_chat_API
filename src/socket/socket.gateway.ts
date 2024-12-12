import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { SocketService } from './socket.service';

@WebSocketGateway({
  cors: {
    origin: '*', // Permite todas as origens (modifique conforme necessário)
  },
})
export class SocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  private logger: Logger = new Logger('WebSocketGateway');
  constructor(private readonly socketService: SocketService) { }

  afterInit(server: Server) {
    this.logger.log('WebSocket initialized');
  }

  handleConnection(client: Socket) {
    client.emit('users', [{ name: 'erick' }]);
    this.socketService.handleConnection(client);

    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('message')
  handleMessage(
    @MessageBody()
    data: {
      to: string;
      message: string;
      sender: string;
      chat: string;
      isChannel: boolean;
    },
  ): string {
    console.log(data);
    this.logger.log(`Received message: ${data}`);
    // this.socketService.handleMessage(data)

    if (data.isChannel) {
      const payload = {
        content: data.message,
        chat: data.chat,
        user: data.sender,
        date: new Date().toISOString()
      };
      this.server.to(data.to).emit('message', payload);
    } else {
      const payload = {
        content: data.message,
        chat: data.sender,
        user: data.sender,
        date: new Date().toISOString()
      };
      this.server.emit('message', payload);
    }

    // this.server
    //   .to(data.to)
    //   .emit('message', { content: data.message, user: data.sender }); // Reenvia a mensagem para todos os clientes
    return `Message received: ${data}`;
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, data: { nickname: string; room: string }) {
    // this.socketService.addClientToRoom(client, room);
    client.join(data.room);
    if (data.room != 'geral') {
      client.leave('geral');
    }
    if (data.room != 'geral') {
      this.server.to(data.room).emit('message', {
        content: `${data.nickname} entrou na sala ${data.room}`,
        user: null,
        date: new Date().toISOString()
      });
    }
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(client: Socket, room: string) {
    // this.socketService.removeClientFromRoom(client, room);
    client.leave(room);
    client.join('geral');
    if (room != 'geral') {
      this.server.to(room).emit('message', {
        content: `${client.id} left the room ${room}`,
        user: null,
      });
    }
  }
}
