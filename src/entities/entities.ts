// src/entities/entities.ts
import { Role } from './role.entity';
import { SensorData } from './sensor-data.entity';
import { User } from './user.entity';
import { UserLog } from './user.log.entity';

export const allEntities = [SensorData, User, UserLog, Role];
