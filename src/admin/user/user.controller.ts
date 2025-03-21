import { Body, Controller, ForbiddenException, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/guards/roles.decorator';
import { UserService } from './user.service';

@Controller('user')
export class UserController {

  constructor(
    private readonly userService: UserService,
  ) { }

  @Get('email/:email')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('system_admin', 'company_admin', 'user')
  async findByEmail(@Param('email') email: string, @Req() req) {
    const loggedInUserId = req.user.userId;
    return this.userService.findByEmail(email, loggedInUserId);
  }

  @Get('role/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('system_admin', 'company_admin', 'user')
  async findByIdWithRoles(@Param('id') id: string, @Req() req) {
    const loggedInUserId = req.user.userId;
    return this.userService.findByIdWithRoles(id, loggedInUserId);
  }

  @Get('sensor-data')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user')
  async getUserSensorData(@Req() req) {
    const loggedInUserId = req.user.userId;

    return this.userService.getUserSensorData(loggedInUserId);
  }


}
