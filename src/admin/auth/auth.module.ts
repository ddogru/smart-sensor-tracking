import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt'; 
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from 'src/entities/role.entity';
import { LogModule } from '../log/log.module';
import { User } from 'src/entities/user.entity';
import { RolesGuard } from './guards/roles.guard';
import { Company } from 'src/entities/company.entity';

@Module({
  imports: [
    ConfigModule, 
    UserModule,
    PassportModule,
    LogModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET_KEY'),
        signOptions: { expiresIn: '1h' }, 
      }),
    }),
    TypeOrmModule.forFeature([User, Role, Company]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RolesGuard], 
  exports: [AuthService], 
})
export class AuthModule {}