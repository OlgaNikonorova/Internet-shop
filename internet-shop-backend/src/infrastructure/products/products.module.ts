import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/domain/entities/product.entity';
import { ProductsService } from 'src/application/products/products.service';
import { RecommendationsGateway } from '@app/products/recommendations.gateway';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Review } from '@entities/review.entity';
import { User } from '@entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Review, User]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        const secret = configService.get<string>('JWT_SECRET');

        if (!secret) {
          throw new Error('JWT_SECRET is not defined in .env');
        }

        return {
          secret,
          signOptions: { expiresIn: '15m' },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [ProductsService, RecommendationsGateway],
  controllers: [ProductsController],
})
export class ProductsModule {}
