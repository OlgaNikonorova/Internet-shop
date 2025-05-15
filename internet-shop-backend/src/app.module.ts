import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './infrastructure/config/typeorm.config';
import { UsersModule } from './infrastructure/users/users.module';
import { AuthModule } from './infrastructure/auth/auth.module';
import { ProductsModule } from './infrastructure/products/products.module';
import { CartModule } from './infrastructure/cart/cart.module';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { JwtGuard } from '@common/guards/jwt.guard';
import { UnauthorizedInterceptor } from '@common/interceptors/unauthorized.interceptor';
import { FavoritesModule } from './infrastructure/favorites/favorites.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ReviewsModule } from './infrastructure/reviews/reviews.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync(typeOrmConfig),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    UsersModule,
    AuthModule,
    ProductsModule,
    CartModule,
    FavoritesModule,
    ReviewsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: UnauthorizedInterceptor,
    },
  ],
})
export class AppModule {}
