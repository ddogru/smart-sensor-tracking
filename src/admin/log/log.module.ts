import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogService } from './log.service';
import { UserLog } from 'src/entities/user.log.entity';
import { User } from 'src/entities/user.entity';
import { InvalidSensorDataLog } from 'src/entities/invalid-sensor-data-log.entity';
import { Sensor } from 'src/entities/sensor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserLog, User, InvalidSensorDataLog, Sensor])],
  providers: [LogService],
  controllers: [],
  exports: [LogService], 
})
export class LogModule {}
