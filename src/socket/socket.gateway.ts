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
  
    afterInit(server: Server) {
      this.logger.log('WebSocket initialized');
    }
  
    handleConnection(client: Socket) {
      this.logger.log(`Client connected: ${client.id}`);
    }
  
    handleDisconnect(client: Socket) {
      this.logger.log(`Client disconnected: ${client.id}`);
    }
  
    @SubscribeMessage('message')
    handleMessage(@MessageBody() data: any): string {
      this.logger.log(`Received message: ${data}`);
      this.server.emit('message', data); // Reenvia a mensagem para todos os clientes
      return `Message received: ${data}`;
    }
  }
  