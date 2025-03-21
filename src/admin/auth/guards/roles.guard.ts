import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { UserService } from 'src/admin/user/user.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.get<string[]>(ROLES_KEY, context.getHandler());

    console.log('RolesGuard triggered');  

    if (!requiredRoles) return true; // If no roles required, allow access.

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    console.log('User making request:', user); 

    if (!user) throw new ForbiddenException('User not authenticated');

    // Fetch user from DB to get their role
    const userWithRole = await this.userRepository.findOne({
      where: { id: user.userId },
      relations: ['role'], // Ensure role is included
    });

    if (!userWithRole || !userWithRole.role) {
      throw new ForbiddenException('User role not found');
    }

    const userRole = userWithRole.role.name; // Get the single role name
    console.log('User role:', userRole);

    // Check if user's role matches any of the required roles
    if (!requiredRoles.includes(userRole)) {
      throw new ForbiddenException(`Access denied: You need one of these roles: ${requiredRoles.join(', ')}`);
    }

    return true;
  }
}
