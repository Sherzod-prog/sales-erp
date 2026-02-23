import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { ProductModule } from './product/product.module';
import { SalesModule } from './sales/sales.module';

@Module({
  imports: [AuthModule, ProductModule, SalesModule],
  controllers: [AppController, AuthController, UserController],
  providers: [AppService, PrismaService, AuthService, UserService],
})
export class AppModule {}
