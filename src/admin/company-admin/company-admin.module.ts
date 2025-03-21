import { Module } from '@nestjs/common';
import { CompanyAdminController } from './company-admin.controller';
import { CompanyAdminService } from './company-admin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from 'src/entities/company.entity';
import { Role } from 'src/entities/role.entity';
import { SensorData } from 'src/entities/sensor-data.entity';
import { User } from 'src/entities/user.entity';
import { UserModule } from '../user/user.module';
import { LogModule } from '../log/log.module';
import { Sensor } from 'src/entities/sensor.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Company, Role, Sensor, SensorData]),
    UserModule,
    LogModule,
  ],
  controllers: [CompanyAdminController],
  providers: [CompanyAdminService],
})
export class CompanyAdminModule {}
