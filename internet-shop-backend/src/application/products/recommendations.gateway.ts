import { PingDto } from '@dto/product/ping.dto';
import { ProductRecommendationsDto } from '@dto/product/product-recommendations.dto';
import { JwtPayload } from '@interfaces/jwt-payload.interface';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { AsyncApiPub, AsyncApiSub } from 'nestjs-asyncapi';
import { Server } from 'ws';

@Injectable()
@WebSocketGateway({
  cors: { origin: '*' },
  path: '/recommendations',
})
export class RecommendationsGateway
  implements OnGatewayInit, OnGatewayConnection
{
  @WebSocketServer()
  server: Server;

  private readonly _logger = new Logger(RecommendationsGateway.name);
  private readonly _clients = new Map<string, WebSocket>();

  constructor(private readonly _jwtService: JwtService) {}

  public afterInit() {
    this._logger.log(`WebSocket server initialized`);
  }

  async handleConnection(client: WebSocket, ...args: any[]) {
    try {
      const token = this.getTokenFromArgs(args);

      if (!token) {
        throw new UnauthorizedException('No JWT token provided');
      }

      const payload = await this._jwtService.verifyAsync<JwtPayload>(token);
      const userId = payload.sub;

      this._clients.set(userId, client);
      this._logger.log(`Client connected: ${userId}`);

      client.send(JSON.stringify({ event: 'connected', data: { userId } }));

      client.onclose = () => {
        this._clients.delete(userId);
        this._logger.log(`Client disconnected: ${userId}`);
      };
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      this._logger.error(`Connection error: ${error.message}`);

      client.send(
        JSON.stringify({ event: 'error', data: { message: 'Unauthorized' } }),
      );

      client.close();
    }
  }

  @AsyncApiPub({
    channel: 'recommendations',
    message: {
      name: 'recommendations',
      payload: ProductRecommendationsDto,
    },
    description: 'Sends product recommendations to the client',
  })
  public notifyRecommendations(
    userId: string,
    recommendations: ProductRecommendationsDto,
  ) {
    const client = this._clients.get(userId);

    if (client && client.readyState === WebSocket.OPEN) {
      client.send(
        JSON.stringify({
          event: 'recommendations',
          data: recommendations.recommendations,
        }),
      );

      this._logger.log(
        `Sent recommendations to ${userId}: ${recommendations.recommendations.length} items`,
      );
    }
  }

  @AsyncApiSub({
    channel: 'recommendations',
    message: {
      name: 'ping',
      payload: PingDto,
    },
    description:
      'Receives a ping message from the client and responds with pong',
  })
  @SubscribeMessage('ping')
  public handlePing(@ConnectedSocket() client: WebSocket): void {
    client.send(
      JSON.stringify({
        event: 'pong',
        data: { timestamp: new Date().toISOString() },
      }),
    );
  }

  private getTokenFromArgs(args: any[]): string | undefined {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    return args[0]?.headers?.authorization?.replace('Bearer ', '');
  }
}
