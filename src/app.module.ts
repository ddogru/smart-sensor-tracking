import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './admin/auth/auth.module';
import { UserModule } from './admin/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { allEntities } from './entities/entities';
import { ConfigModule } from '@nestjs/config';
import { MqttModule } from './services/mqtt.module';
import { SystemAdminModule } from './admin/system-admin/system-admin.module';
import { CompanyAdminModule } from './admin/company-admin/company-admin.module';
import { ThrottlerModule } from '@nestjs/throttler'; // Import ThrottlerModule
import { MqttService } from './services/mqtt.service';

dotenv.config();

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 5,
        },
      ],
    }),
    
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      entities: allEntities,
      database: process.env.POSTGRES_DATABASE,
      synchronize: true,  
      autoLoadEntities: true, 
    }),

    AuthModule, 
    UserModule, 
    MqttModule,
    SystemAdminModule, 
    CompanyAdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}