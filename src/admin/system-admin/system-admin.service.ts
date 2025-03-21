import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateRolesDto } from './dto/update-roles.dto';
import { ManageIoTDto } from './dto/manage-iot.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from 'src/entities/company.entity';
import { Role } from 'src/entities/role.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { LogService } from '../log/log.service';
import { SensorData } from 'src/entities/sensor-data.entity';
import { Sensor } from 'src/entities/sensor.entity';
import { InvalidSensorDataLog } from 'src/entities/invalid-sensor-data-log.entity';
import { CreateSensorDto } from './dto/create-sensor.dto';

@Injectable()
export class SystemAdminService {

    constructor(
        @InjectRepository(Company)
        private companyRepository: Repository<Company>,

        @InjectRepository(User)
        private userRepository: Repository<User>,

        @InjectRepository(Role)
        private roleRepository: Repository<Role>,

        @InjectRepository(Sensor)
        private sensorRepository: Repository<Sensor>,

        @InjectRepository(InvalidSensorDataLog)
        private readonly invalidSensorDataLogRepository: Repository<InvalidSensorDataLog>,

        @InjectRepository(SensorData)
        private sensorDataRepository: Repository<SensorData>,

        private readonly logService: LogService,

    ) { }

    async getAllUsers(systemAdminId: string) {

        const users = await this.userRepository.find({ relations: ['role', 'company'] });

        await this.logService.logUserAction(systemAdminId, `Viewed all users`);

        return users;
    }


    async createCompany(createCompanyDto: CreateCompanyDto, systemAdminId: string) {

        const company = this.companyRepository.create(createCompanyDto);
        const savedCompany = await this.companyRepository.save(company);

        await this.logService.logUserAction(systemAdminId, `Created company ${savedCompany.name} (ID: ${savedCompany.id})`);

        return savedCompany;
    }


    async createUser(createUserDto: CreateUserDto, systemAdminId: string) {
        const { name, email, password, roleName, companyName } = createUserDto;

        const roleEntity = await this.roleRepository.findOne({ where: { name: roleName } });
        const company = await this.companyRepository.findOne({ where: { name: companyName } });



        if (!company || !roleEntity) {
            throw new Error('Company or Role not found');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = this.userRepository.create({
            name,
            email,
            password: hashedPassword,
            role: roleEntity,
            company: company,
        });

        const savedUser = await this.userRepository.save(user);

        // Log the action
        await this.logService.logUserAction(systemAdminId, `System Admin created user ${name} (ID: ${savedUser.id})`);

        return savedUser;
    }

    async createSensor(createSensorDto: CreateSensorDto, systemAdminId: string) {
        const { name, companyId } = createSensorDto;
    
        const company = await this.companyRepository.findOne({ where: { id: companyId } });
    
        if (!company) {
          throw new NotFoundException('Company not found');
        }
    
        const sensor = this.sensorRepository.create({
          name,
          company,  
        });
    
        const savedSensor = await this.sensorRepository.save(sensor);
    
        await this.logService.logUserAction(systemAdminId, `Created sensor ${savedSensor.name} (ID: ${savedSensor.id}) for company '${company.name}'`);
    
        return savedSensor; 
      }

    async updateRoles(updateRolesDto: UpdateRolesDto, systemAdminId: string) {
        const { userId, newRole } = updateRolesDto;

        const user = await this.userRepository.findOne({ where: { id: userId } });
        const role = await this.roleRepository.findOne({ where: { name: newRole } });

        if (!user || !role) {
            throw new Error('User or Role not found');
        }

        user.role = role;
        await this.userRepository.save(user);
        await this.logService.logUserAction(systemAdminId, `Updated role of user ${user.name} (ID: ${user.id}) to ${newRole}`);

        return { message: 'Role updated successfully' };
    }

    async getAllLogs(systemAdminId: string) {

        await this.logService.logUserAction(systemAdminId, `Viewed system logs`);

        return this.logService.getAllLogs();
    }

    async getAllInvalidSensorDataLogs(systemAdminId: string) {
        
        await this.logService.logUserAction(systemAdminId, `Viewed all invalid sensor data logs`);

        return this.invalidSensorDataLogRepository.find();
    }

    async getAllSensorData(systemAdminId: string) {

        const sensors = await this.sensorRepository.find({
            relations: ['sensorData', 'company'],
        });

        const sensorData = sensors.flatMap(sensor => ({
            sensorId: sensor.id,
            sensorName: sensor.name,
            companyName: sensor.company?.name || 'No Company',
            sensorData: sensor.sensorData,
        }));

        await this.logService.logUserAction(
            systemAdminId,
            `Viewed all sensor data`
        );

        return sensorData;
    }


    async manageIoTIntegration(manageIoTDto: ManageIoTDto, systemAdminId: string) {
        const { userId, sensorId } = manageIoTDto;

        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['company', 'sensors'],
        });

        if (!user || !user.company) {
            throw new NotFoundException('User not found or does not belong to any company');
        }

        const sensor = await this.sensorRepository.findOne({
            where: { id: sensorId },
            relations: ['company'],
        });

        if (!sensor || !sensor.company) {
            throw new NotFoundException('Sensor not found or does not belong to any company');
        }

        if (user.company.id !== sensor.company.id) {
            throw new ForbiddenException('Sensor and user do not belong to the same company');
        }

        if (user.sensors.some((existingSensor) => existingSensor.id === sensorId)) {
            throw new ForbiddenException('Sensor is already assigned to this user');
        }

        user.sensors.push(sensor);
        await this.userRepository.save(user);

        await this.logService.logUserAction(
            systemAdminId,
            `Assigned sensor '${sensor.name}' to user '${user.name}' (User ID: ${user.id})`
        );

        return { message: 'Sensor assigned to user successfully' };
    }



    async deleteUser(userId: string, systemAdminId: string) {
        const user = await this.userRepository.findOne({ where: { id: userId } });

        if (!user) {
            throw new Error('User not found');
        }

        await this.userRepository.softDelete(userId);

        await this.logService.logUserAction(systemAdminId, `Soft deleted user ${user.name} (ID: ${user.id})`);

        return { message: 'User soft deleted successfully' };
    }

}
