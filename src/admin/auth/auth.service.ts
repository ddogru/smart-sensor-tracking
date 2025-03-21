import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service'; 
import { Role } from 'src/entities/role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { LogService } from '../log/log.service';
import { User } from 'src/entities/user.entity';
import { Company } from 'src/entities/company.entity';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService, 

    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Role)
    private roleRepository: Repository<Role>,

    @InjectRepository(Company)
    private companyRepository: Repository<Company>,

    private readonly logService: LogService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      console.error('User not found:', email);  // Debugging line
      throw new Error('Invalid credentials');
    }
  
    console.log('Password from request:', password);  // Debugging line
    console.log('Hashed password from DB:', user.password);  // Debugging line
  
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.error('Password mismatch for:', email);  // Debugging line
      throw new Error('Invalid credentials');
    }
  
    const payload = { id: user.id, email: user.email };
    const token = this.jwtService.sign(payload);

    await this.logService.logUserAction(user.id, `User ${user.email} logged in`);

    return { access_token: token };
  }
  

  async register(registerDto: { 
    name: string; 
    email: string; 
    password: string; 
    role: string; 
    companyName?: string; 
  }) {
    const { name, email, password, role, companyName } = registerDto;
  
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new Error('Email already exists');
    }
  
    const userRole = await this.roleRepository.findOne({ where: { name: role } });
    if (!userRole) {
      throw new Error('Role not found');
    }
  
    let company = null;
  
    if (role !== 'system_admin') {
      if (!companyName) {
        throw new Error('Company name is required for Company Admins and Users');
      }
  
      company = await this.companyRepository.findOne({ where: { name: companyName } });
      if (!company) {
        throw new Error('Company not found');
      }
    }
  
    const hashedPassword = await bcrypt.hash(password, 10);
  
    const newUser = this.userRepository.create({
      name,
      email,
      password: hashedPassword,
      role: userRole,
      company, 
    });
  
    const savedUser = await this.userRepository.save(newUser);
  
    await this.logService.logUserAction(savedUser.id, `User ${name} registered`);
  
    return {
      access_token: this.jwtService.sign({ id: savedUser.id, email: newUser.email }),
    };
  }
  
}
