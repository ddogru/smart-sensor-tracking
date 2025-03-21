// src/entities/entities.ts
import { Company } from './company.entity';
import { InvalidSensorDataLog } from './invalid-sensor-data-log.entity';
import { Role } from './role.entity';
import { SensorData } from './sensor-data.entity';
import { Sensor } from './sensor.entity';
import { User } from './user.entity';
import { UserLog } from './user.log.entity';

export const allEntities = [Sensor, SensorData, InvalidSensorDataLog, User, UserLog, Role, Company];
