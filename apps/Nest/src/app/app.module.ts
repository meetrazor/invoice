import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { InvoiceModule } from './invoice/invoice.module';

@Module({
  imports: [
    JwtModule.register({
      secret: 'test',
      signOptions: { expiresIn: '3600s' },
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT, 10) || 3306,
      username: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'testUser@123',
      database: process.env.DB_NAME || 'invoice',
      autoLoadEntities: true,
      synchronize: true, // Use only for development
    }),
    UserModule,
    InvoiceModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtStrategy],
})
export class AppModule {}
