import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { UserLog } from 'src/entities/user.log.entity';
import { User } from 'src/entities/user.entity';
import { Company } from 'src/entities/company.entity';
import { InvalidSensorDataLog } from 'src/entities/invalid-sensor-data-log.entity';
import { Sensor } from 'src/entities/sensor.entity';

@Injectable()
export class LogService {
  constructor(
    @InjectRepository(UserLog)
    private readonly logRepository: Repository<UserLog>,

    @InjectRepository(InvalidSensorDataLog)
    private readonly invalidSensorDataLogRepository: Repository<InvalidSensorDataLog>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Sensor)
    private readonly sensorRepository: Repository<Sensor>,
  ) { }

  async logUserAction(userId: string, action: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }

    const logEntry = this.logRepository.create({
      user,  // Assign user object, not just userId
      action,
    });

    return this.logRepository.save(logEntry);
  }

  async logInvalidSensorData(sensorId: string, sensorData: any, errorMessage: string) {
    const sensor = await this.sensorRepository.findOne({ where: { id: sensorId } });

    if (!sensor) {
      console.error(`Sensor with ID ${sensorId} not found. Cannot log invalid data.`);
      return;
    }

    const logEntry = this.invalidSensorDataLogRepository.create({
      sensor,
      invalid_data: sensorData,
      error_message: errorMessage,
    });

    return this.invalidSensorDataLogRepository.save(logEntry);
  }

  async getInvalidSensorLogs(sensorId: string) {
    return this.invalidSensorDataLogRepository.find({
      where: { sensor: { id: sensorId } },
      relations: ['sensor'],
      order: { timestamp: 'DESC' },
    });
  }
  


  async getAllLogs() {
    return this.logRepository.find({ relations: ['user'] });
  }

  async getUserLogsByCompany(companyId: string) {
    return this.logRepository.find({
      where: {
        user: {
          company: { id: companyId },
        },
      },
      relations: ['user', 'company'],
    });
  }

}
