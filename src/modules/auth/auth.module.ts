import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { SecurityService } from './security.service';
import { GoogleStrategy } from 'src/common/guards/google.strategy';

@Module({
  imports: [
    ConfigModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'jwt-secret',
      signOptions: { expiresIn: '15m' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, SecurityService, GoogleStrategy],
  exports: [AuthService, SecurityService],
})
export class AuthModule {}
