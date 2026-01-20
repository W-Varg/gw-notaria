import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleStrategy } from '../../common/guards/google.strategy';
import { GuardsModule } from '../../common/guards/guards.module';
import { AuthController } from './auth.controller';
import { ProfileModule } from './profile/profile.module';

@Module({
  imports: [GuardsModule, ProfileModule],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy],
  exports: [AuthService],
})
export class AuthModule {}
