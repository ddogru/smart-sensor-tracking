import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './admin/auth/auth.module';
import { UsersModule } from './admin/users/users.module';
import { CompaniesModule } from './admin/companies/companies.module';
import { SensorsModule } from './main/sensors/sensors.module';
import { LogsModule } from './main/logs/logs.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { allEntities } from './entities/entities';
dotenv.config();

@Module({
  imports: [
    // Database configuration using environment variables
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      entities: allEntities,
      database: process.env.POSTGRES_DATABASE,
      synchronize: true,  // Automatically synchronize the database schema
      autoLoadEntities: true,  // Auto load entities
    }),

    // Your modules
    AuthModule, 
    UsersModule, 
    CompaniesModule, 
    SensorsModule, 
    LogsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
