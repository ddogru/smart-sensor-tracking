import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // Login endpoint
  @Post('login')
  async login(@Body() loginDto: { email: string; password: string }) {
    return await this.authService.login(loginDto.email, loginDto.password);
  }

  // Register endpoint
  @Post('register')
  async register(@Body() registerDto: { name: string; email: string; password: string; role: string }) {
    return await this.authService.register(registerDto);
  }
}
