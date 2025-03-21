import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MqttService } from './mqtt.service';
import { SensorData } from 'src/entities/sensor-data.entity';
import { LogModule } from 'src/admin/log/log.module';

@Module({
  imports: [
    LogModule, 
    TypeOrmModule.forFeature([SensorData])
  ], 
  providers: [MqttService],
  exports: [MqttService], 
})
export class MqttModule {}
