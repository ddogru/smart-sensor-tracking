import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { Role } from '../../entities/role.entity';
import { LogService } from '../log/log.service';
import { SensorData } from 'src/entities/sensor-data.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Role)
    private roleRepository: Repository<Role>,

    @InjectRepository(SensorData)
    private sensorDataRepository: Repository<SensorData>,

    private readonly logService: LogService,
  ) { }


  async findByEmail(email: string, loggedInUserId?: string): Promise<User | undefined> {

    const user = await this.userRepository.findOne({ where: { email } });

    if (user && loggedInUserId) {
      await this.logService.logUserAction(loggedInUserId, `Accessed to ${user.name} ${user.email}'s profile`);
    }

    return user;

  }

  async findByIdWithRoles(id: string, loggedInUserId: string) {
    const user = await this.userRepository.findOne({ where: { id }, relations: ['role'] });

    if (user) {
      await this.logService.logUserAction(loggedInUserId, `Checked the role of ${user.name} (ID: ${user.id}).`);
    }

    return user;
  }

  async getUserSensorData(loggedInUserId: string) {

    const user = await this.userRepository.findOne({
      where: { id: loggedInUserId },
      relations: ['sensors'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.sensors || user.sensors.length === 0) {
      throw new ForbiddenException('User has no assigned sensors');
    }

    const sensorIds = user.sensors.map(sensor => sensor.id);

    const sensorData = await this.sensorDataRepository.find({
      where: { sensor: { id: In(sensorIds) } },
      relations: ['sensor'],
      order: { timestamp: 'DESC' },
    });

    const result = user.sensors.map(sensor => {
      
      const data = sensorData.filter(item => item.sensor.id === sensor.id);

      return {
        sensorId: sensor.id,
        sensorCompanyName: sensor.company?.name,
        sensorName: sensor.name,  
        sensorData: data.length > 0 ? {
          id: data[0].id,
          timestamp: data[0].timestamp,
          temperature: data[0].temperature,
          humidity: data[0].humidity,
        } : {},  
      };
    });

    return result;
  }



}
