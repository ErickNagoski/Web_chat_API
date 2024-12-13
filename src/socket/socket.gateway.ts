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
import { MessagesService } from 'src/messages/messages.service';

@WebSocketGateway({
  cors: {
    origin: '*', // Permite todas as origens (modifique conforme necessário)
  },
})
export class SocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;
  private logger: Logger = new Logger('WebSocketGateway');
  constructor(
    private readonly socketService: SocketService,
    private readonly messagesService: MessagesService,
  ) {}
  private users = [];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  afterInit(server: Server) {
    this.logger.log(`Servidor Iniciado`);
  }

  handleConnection(client: Socket) {
    this.logger.log(`Usuário conectado: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.users = this.users.filter((user) => user.id != client.id);
    this.server.emit('users', this.users);
    this.logger.log(`Usuário desconectado: ${client.id}`);
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
      userId: string;
    },
  ): void {
    this.messagesService.create({
      room: data.to,
      nickName: data.sender,
      content: data.message,
      createdAt: new Date(),
      userId: data.userId,
    });

    if (data.isChannel) {
      const payload = {
        content: data.message,
        chat: data.chat,
        user: data.sender,
        date: new Date().toISOString(),
      };
      this.server.to(data.to).emit('message', payload);
    } else {
      const payload = {
        content: data.message,
        chat: data.sender,
        user: data.sender,
        date: new Date().toISOString(),
      };
      this.server.emit('message', payload);
    }
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, data: { nickname: string; room: string }) {
    client.join(data.room);
    if (data.room != 'geral') {
      client.leave('geral');
    }
    if (data.room != 'geral') {
      this.server.to(data.room).emit('message', {
        content: `${data.nickname} entrou na sala ${data.room}`,
        user: null,
        date: new Date().toISOString(),
      });
    }
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(client: Socket, room: string) {
    client.leave(room);
    client.join('geral');
    if (room != 'geral') {
      this.server.to(room).emit('message', {
        content: `${client.id} left the room ${room}`,
        user: null,
      });
    }
  }

  @SubscribeMessage('activeUser')
  handleActiveUserConnect(
    client: Socket,
    data: { id: string; nickname: string },
  ) {
    this.users.push(data);
    this.server.emit('users', this.users);
  }
}
