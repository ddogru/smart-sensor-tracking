import { Module } from '@nestjs/common';
import { SystemAdminController } from './system-admin.controller';
import { SystemAdminService } from './system-admin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from 'src/entities/company.entity';
import { Role } from 'src/entities/role.entity';
import { User } from 'src/entities/user.entity';
import { UserModule } from '../user/user.module';
import { LogModule } from '../log/log.module';
import { SensorData } from 'src/entities/sensor-data.entity';
import { UserLog } from 'src/entities/user.log.entity';
import { Sensor } from 'src/entities/sensor.entity';
import { InvalidSensorDataLog } from 'src/entities/invalid-sensor-data-log.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Company, Role, User, UserLog, Sensor, SensorData, InvalidSensorDataLog]),
    UserModule, 
    LogModule,
  ],
  controllers: [SystemAdminController],
  providers: [SystemAdminService],
})
export class SystemAdminModule {}
