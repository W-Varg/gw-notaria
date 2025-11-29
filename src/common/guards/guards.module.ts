import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { TokenAuthGuard } from './token-auth.guard';
import { PermissionsGuard } from './permision.guard';
import { SecurityService } from 'src/modules/auth/security.service';

@Global()
@Module({
  imports: [
    ConfigModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'jwt-secret',
      signOptions: { expiresIn: '15m' },
    }),
  ],
  providers: [TokenAuthGuard, PermissionsGuard, SecurityService],
  exports: [TokenAuthGuard, PermissionsGuard, SecurityService],
})
export class GuardsModule {}
