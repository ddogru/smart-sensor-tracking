import { Controller, Post, Body, Get, Param, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/guards/roles.decorator';
import { CompanyAdminService } from './company-admin.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ManageIoTDto } from './dto/manage-iot.dto';
import { UpdateUserPermissionsDto } from './dto/update-user-permissions.dto';

@Controller('company-admin')
export class CompanyAdminController {
    constructor(
        private readonly companyAdminService: CompanyAdminService
    ) { }

    @Post('create-user')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('company_admin')
    createUser(@Body() createUserDto: CreateUserDto, @Req() req) {
        const companyAdminId = req.user.userId;
        return this.companyAdminService.createUser(createUserDto, companyAdminId);
    }

    @Get('users')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('company_admin')
    getUsersByCompany(@Req() req) {
        const companyAdminId = req.user.userId;
        return this.companyAdminService.getUsersByCompany(companyAdminId);
    }

    @Get('user-logs')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('company_admin')
    getUserLogsByCompany(@Req() req) {
        const companyAdminId = req.user.userId;
        return this.companyAdminService.getUserLogsByCompany(companyAdminId);
    }

    @Get('sensor-data')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('company_admin')
    getCompanySensorData(@Req() req) {
        const companyAdminId = req.user.userId;
        return this.companyAdminService.getCompanySensorData(companyAdminId);
    }


    @Post('iot-integration')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('company_admin')
    manageIoTIntegration(@Body() manageIoTDto: ManageIoTDto, @Req() req) {
        const companyAdminId = req.user.userId;
        return this.companyAdminService.manageIoTIntegration(manageIoTDto, companyAdminId);
    }
}
