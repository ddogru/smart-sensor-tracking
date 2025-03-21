import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/guards/roles.decorator';
import { SystemAdminService } from './system-admin.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateRolesDto } from './dto/update-roles.dto';
import { ManageIoTDto } from './dto/manage-iot.dto';
import { CreateSensorDto } from './dto/create-sensor.dto';

@Controller('system-admin')
export class SystemAdminController {
  constructor(
    private readonly systemAdminService: SystemAdminService
  ) { }

  @Get('all-users')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('system_admin')
  getAllUsers(@Req() req) {
    const systemAdminId = req.user.userId;
    return this.systemAdminService.getAllUsers(systemAdminId);
  }


  @Post('create-company')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('system_admin')
  createCompany(@Body() createCompanyDto: CreateCompanyDto, @Req() req) {
    const systemAdminId = req.user.userId;
    return this.systemAdminService.createCompany(createCompanyDto, systemAdminId);
  }

  @Post('create-user')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('system_admin')
  createUser(@Body() createUserDto: CreateUserDto, @Req() req) {
    const systemAdminId = req.user.userId;
    return this.systemAdminService.createUser(createUserDto, systemAdminId);
  }

  @Post('create-sensor')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('system_admin')
  createSensor(@Body() createSensorDto: CreateSensorDto, @Req() req) {
    const systemAdminId = req.user.userId;
    return this.systemAdminService.createSensor(createSensorDto, systemAdminId);
  }

  @Post('update-roles')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('system_admin')
  updateRoles(@Body() updateRolesDto: UpdateRolesDto, @Req() req) {
    const systemAdminId = req.user.userId;
    return this.systemAdminService.updateRoles(updateRolesDto, systemAdminId);
  }

  @Get('logs')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('system_admin')
  getAllLogs(@Req() req) {
    const systemAdminId = req.user.userId;
    return this.systemAdminService.getAllLogs(systemAdminId);
  }

  @Get('invalid-sensor-data-logs')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('system_admin')
  getAllInvalidSensorDataLogs(@Req() req) {
    const systemAdminId = req.user.userId;
    return this.systemAdminService.getAllInvalidSensorDataLogs(systemAdminId);
  }

  @Get('sensor-data')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('system_admin')
  getAllSensorData(@Req() req) {
    const systemAdminId = req.user.userId;
    return this.systemAdminService.getAllSensorData(systemAdminId);
  }


  @Post('iot-integration')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('system_admin')
  manageIoTIntegration(@Body() manageIoTDto: ManageIoTDto, @Req() req) {
    const systemAdminId = req.user.userId;
    return this.systemAdminService.manageIoTIntegration(manageIoTDto, systemAdminId);
  }

  @Post('delete-user')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('system_admin')
  deleteUser(@Body('userId') userId: string, @Req() req) {
    const systemAdminId = req.user.userId;
    return this.systemAdminService.deleteUser(userId, systemAdminId);
  }

}
