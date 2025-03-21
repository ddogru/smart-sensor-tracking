import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { ManageIoTDto } from './dto/manage-iot.dto';
import { UpdateUserPermissionsDto } from './dto/update-user-permissions.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from 'src/entities/company.entity';
import { Role } from 'src/entities/role.entity';
import { User } from 'src/entities/user.entity';
import { In, Repository } from 'typeorm';
import { SensorData } from 'src/entities/sensor-data.entity';
import { LogService } from '../log/log.service';
import * as bcrypt from 'bcryptjs';
import { Sensor } from 'src/entities/sensor.entity';

@Injectable()
export class CompanyAdminService {
    constructor(

        @InjectRepository(User)
        private userRepository: Repository<User>,

        @InjectRepository(Company)
        private companyRepository: Repository<Company>,

        @InjectRepository(Role)
        private roleRepository: Repository<Role>,

        @InjectRepository(Sensor)
        private readonly sensorRepository: Repository<Sensor>,

        @InjectRepository(SensorData)
        private sensorDataRepository: Repository<SensorData>,

        private readonly logService: LogService,

    ) { }

    async createUser(createUserDto: CreateUserDto, companyAdminId: string) {
        const { name, email, password, roleName } = createUserDto;

        const companyAdmin = await this.userRepository.findOne({
            where: { id: companyAdminId },
            relations: ['company'], 
        });

        if (!companyAdmin || !companyAdmin.company) {
            throw new Error('Company Admin or associated Company not found');
        }

        const company = companyAdmin.company;

        const role = await this.roleRepository.findOne({ where: { name: roleName } });
        if (!role) {
            throw new Error('Role not found');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = this.userRepository.create({
            name,
            email,
            password: hashedPassword,
            role,
            company: company,
        });

        const savedUser = await this.userRepository.save(user);

        await this.logService.logUserAction(companyAdminId, `Created user ${name} (ID: ${savedUser.id}) in company ${companyAdmin.company.name}`);

        return savedUser;
    }

    async getUsersByCompany(companyAdminId: string) {

        const companyAdmin = await this.userRepository.findOne({
            where: { id: companyAdminId },
            relations: ['company'], 
        });

        if (!companyAdmin || !companyAdmin.company) {
            throw new Error('Company Admin or associated Company not found');
        }

        const users = await this.userRepository.find({
            where: { company: { id: companyAdmin.company.id } },
            relations: ['role'],
        });

        await this.logService.logUserAction(
            companyAdminId,
            `Viewed users of company '${companyAdmin.company.name}' (Company ID: ${companyAdmin.company.id})`
        );

        return users;
    }

    async getUserLogsByCompany(companyAdminId: string) {

        const companyAdmin = await this.userRepository.findOne({
            where: { id: companyAdminId },
            relations: ['company'],
        });

        if (!companyAdmin || !companyAdmin.company) {
            throw new Error('Company Admin or associated Company not found');
        }

        await this.logService.logUserAction(
            companyAdminId,
            `Viewed logs for users in company '${companyAdmin.company.name}' (ID: ${companyAdmin.company.id})`
        );

        const users = await this.userRepository.find({
            where: { company: { id: companyAdmin.company.id } },
            relations: ['userLogs'],
        });

        const logs = users.flatMap(user =>
            user.userLogs.map(log => ({
                ...log,
                userId: user.id,
            }))
        );

        return logs;
    }

    async getCompanySensorData(companyAdminId: string) {

        const companyAdmin = await this.userRepository.findOne({
            where: { id: companyAdminId },
            relations: ['company'],
        });

        if (!companyAdmin || !companyAdmin.company) {
            throw new Error('Company Admin or associated Company not found');
        }

        const sensors = await this.sensorRepository.find({
            where: { company: { id: companyAdmin.company.id } },
            relations: ['sensorData'],
        });

        const sensorData = sensors.map(sensor => ({
            sensorId: sensor.id,
            sensorName: sensor.name,
            companyName: sensor.company?.name || 'No Company',
            sensorData: sensor.sensorData,
        }));

        await this.logService.logUserAction(
            companyAdminId,
            `Viewed sensor data for company '${companyAdmin.company.name}' (Company ID: ${companyAdmin.company.id})`
        );

        return sensorData;
    }

    async manageIoTIntegration(manageIoTDto: ManageIoTDto, companyAdminId: string) {
        const { userId, sensorId } = manageIoTDto;

        const companyAdmin = await this.userRepository.findOne({
            where: { id: companyAdminId },
            relations: ['company'],
        });

        if (!companyAdmin || !companyAdmin.company) {
            throw new NotFoundException('Company Admin or associated Company not found');
        }

        const user = await this.userRepository.findOne({
            where: { id: userId, company: { id: companyAdmin.company.id } },
            relations: ['company', 'sensors'],
        });

        if (!user || !user.company || user.company.id !== companyAdmin.company.id) {
            throw new NotFoundException('User not found or does not belong to this company');
        }


        const sensor = await this.sensorRepository.findOne({
            where: { id: sensorId, company: { id: companyAdmin.company.id } },
        });

        if (!sensor) {
            throw new NotFoundException('Sensor not found or does not belong to this company');
        }

        if (user.sensors.some((existingSensor) => existingSensor.id === sensorId)) {
            throw new ForbiddenException('Sensor is already assigned to this user');
        }

        user.sensors.push(sensor);
        await this.userRepository.save(user);

        await this.logService.logUserAction(
            companyAdminId,
            `Assigned sensor '${sensor.name}' to user '${user.name}' (User ID: ${user.id})`
        );

        return { message: 'Sensor assigned to user successfully' };
    }
}
