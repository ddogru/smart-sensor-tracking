import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { User } from 'src/entities/user.entity';
import { Role } from 'src/entities/role.entity';
import { Company } from 'src/entities/company.entity';
import { LogModule } from '../log/log.module';
import { UserLog } from 'src/entities/user.log.entity';
import { SensorData } from 'src/entities/sensor-data.entity';
import { UserController } from './user.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, Company, UserLog, SensorData]),
    LogModule,
  ],
  controllers: [UserController],
  providers: [UserService], 
  exports: [UserService], 
})
export class UserModule {}