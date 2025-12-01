import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsDefined,
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
  MaxLength,
  Matches,
  IsBoolean,
} from 'class-validator';
import { DtoPipePlainToClassOptions } from 'src/common/decorators/dto.decorator';

export class RegistrarUserInput {
  @Expose()
  @IsDefined()
  @IsEmail()
  @ApiProperty({
    type: String,
    description: 'Email del usuario',
    example: 'usuario@example.com',
  })
  email: string;

  @Expose()
  @IsDefined()
  @IsString()
  @MinLength(8)
  @MaxLength(100)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message:
      'La contraseña debe contener al menos una letra minúscula, una mayúscula, un número y un carácter especial',
  })
  @ApiProperty({
    type: String,
    description:
      'Contraseña del usuario (mínimo 8 caracteres, debe incluir mayúscula, minúscula, número y carácter especial)',
    example: 'Password123!',
  })
  password: string;

  @Expose()
  @IsDefined()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  @ApiProperty({
    type: String,
    description: 'Nombre del usuario',
    example: 'Juan',
  })
  nombre: string;

  @Expose()
  @IsDefined()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  @ApiProperty({
    type: String,
    description: 'Apellidos del usuario',
    example: 'Pérez García',
  })
  apellidos: string;

  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(20)
  @ApiPropertyOptional({
    type: String,
    description: 'Teléfono del usuario',
    example: '+56912345678',
  })
  telefono?: string;

  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(200)
  @ApiPropertyOptional({
    type: String,
    description: 'Dirección del usuario',
    example: 'Calle Falsa 123, Santiago',
  })
  direccion?: string;
}

export class LoginUserInput {
  @Expose()
  @IsDefined()
  @IsEmail()
  @ApiProperty({
    type: String,
    description: 'Email del usuario',
    example: 'admin@gmail.com',
  })
  email: string;

  @Expose()
  @IsDefined()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Contraseña del usuario',
    example: 'Cambiar123@',
  })
  password: string;

  @Expose()
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    type: String,
    description: 'User Agent del navegador',
    example: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  })
  userAgent?: string;

  @Expose()
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    type: String,
    description: 'Dirección IP del cliente',
    example: '192.168.1.1',
  })
  ipAddress?: string;

  @Expose()
  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Marcar este dispositivo como de confianza' })
  trustDevice?: boolean;

  @Expose()
  @Type(() => String)
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Fingerprint único del dispositivo',
    example: 'a1b2c3d4e5f6g7h8i9j0',
  })
  deviceFingerprint?: string;
}

export class ChangePasswordInput {
  @Expose()
  @IsDefined()
  @IsString()
  @MinLength(8)
  @ApiProperty({
    type: String,
    description: 'Contraseña actual',
    example: 'OldPassword123!',
  })
  currentPassword: string;

  @Expose()
  @IsDefined()
  @IsString()
  @MinLength(8)
  @MaxLength(100)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message:
      'La nueva contraseña debe contener al menos una letra minúscula, una mayúscula, un número y un carácter especial',
  })
  @ApiProperty({
    type: String,
    description:
      'Nueva contraseña (mínimo 8 caracteres, debe incluir mayúscula, minúscula, número y carácter especial)',
    example: 'NewPassword123!',
  })
  newPassword: string;
}

export class ForgotPasswordInput {
  @Expose()
  @IsDefined()
  @IsEmail()
  @ApiProperty({
    type: String,
    description: 'Email del usuario para enviar enlace de recuperación',
    example: 'usuario@example.com',
  })
  email: string;
}

export class ResetPasswordInput {
  @Expose()
  @IsDefined()
  @IsString()
  @MinLength(32)
  @MaxLength(64)
  @ApiProperty({
    type: String,
    description: 'Token de reset de contraseña',
    example: 'a1b2c3d4e5f6789012345678901234567890123456789012345678901234567890',
  })
  token: string;

  @Expose()
  @IsDefined()
  @IsString()
  @MinLength(8)
  @MaxLength(100)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message:
      'La nueva contraseña debe contener al menos una letra minúscula, una mayúscula, un número y un carácter especial',
  })
  @ApiProperty({
    type: String,
    description:
      'Nueva contraseña (mínimo 8 caracteres, debe incluir mayúscula, minúscula, número y carácter especial)',
    example: 'NewSecurePassword123!',
  })
  newPassword: string;
}

export class VerifyEmailInput {
  @Expose()
  @IsDefined()
  @IsString()
  @MinLength(32)
  @MaxLength(64)
  @ApiProperty({
    type: String,
    description: 'Token de verificación de email',
    example: 'a1b2c3d4e5f6789012345678901234567890123456789012345678901234567890',
  })
  token: string;
}

export class RefreshTokenInput {
  @Expose()
  @IsDefined()
  @IsString()
  @MinLength(10)
  @ApiProperty({
    type: String,
    description: 'Refresh token para renovar la sesión',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  refreshToken: string;
}

// DTOs adicionales para endpoints específicos
export class SendEmailLinkInput {
  @Expose()
  @IsDefined()
  @IsEmail()
  @ApiProperty({
    type: String,
    description: 'Email del destinatario',
    example: 'usuario@example.com',
  })
  email: string;
}

export class SendWelcomeEmailInput {
  @Expose()
  @IsDefined()
  @IsEmail()
  @ApiProperty({
    type: String,
    description: 'Email del destinatario',
    example: 'usuario@example.com',
  })
  email: string;

  @Expose()
  @IsDefined()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  @ApiProperty({
    type: String,
    description: 'Nombre del destinatario',
    example: 'Juan Pérez',
  })
  name: string;
}

export class SendVerificationEmailInput {
  @Expose()
  @IsDefined()
  @IsEmail()
  @ApiProperty({
    type: String,
    description: 'Email del destinatario',
    example: 'usuario@example.com',
  })
  email: string;

  @Expose()
  @IsDefined()
  @IsString()
  @MinLength(32)
  @MaxLength(64)
  @ApiProperty({
    type: String,
    description: 'Token de verificación',
    example: 'a1b2c3d4e5f6789012345678901234567890123456789012345678901234567890',
  })
  token: string;
}

export class SendResetPasswordEmailInput {
  @Expose()
  @IsDefined()
  @IsEmail()
  @ApiProperty({
    type: String,
    description: 'Email del destinatario',
    example: 'usuario@example.com',
  })
  email: string;

  @Expose()
  @IsDefined()
  @IsString()
  @MinLength(32)
  @MaxLength(64)
  @ApiProperty({
    type: String,
    description: 'Token de reset',
    example: 'a1b2c3d4e5f6789012345678901234567890123456789012345678901234567890',
  })
  token: string;
}

// ============================================
// DTOs para Two-Factor Authentication (2FA)
// ============================================

@DtoPipePlainToClassOptions()
export class Enable2FAInput {
  @Expose()
  @IsDefined()
  @IsString()
  @MinLength(6)
  @MaxLength(6)
  @Matches(/^[0-9]{6}$/, {
    message: 'El código debe ser de 6 dígitos numéricos',
  })
  @ApiProperty({
    type: String,
    description: 'Código de 6 dígitos de Google Authenticator para habilitar 2FA',
    example: '123456',
  })
  code: string;
}

export class Verify2FAInput {
  @Expose()
  @IsDefined()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'ID del usuario que está verificando 2FA',
    example: 'clr1234567890abcdef',
  })
  userId: string;

  @Expose()
  @IsDefined()
  @IsString()
  @MinLength(6)
  @MaxLength(6)
  @Matches(/^[0-9]{6}$/, {
    message: 'El código debe ser de 6 dígitos numéricos',
  })
  @ApiProperty({
    type: String,
    description: 'Código de 6 dígitos de Google Authenticator',
    example: '123456',
  })
  code: string;

  @Expose()
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    type: String,
    description: 'User Agent del navegador',
    example: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  })
  userAgent?: string;

  @Expose()
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    type: String,
    description: 'Dirección IP del cliente',
    example: '192.168.1.1',
  })
  ipAddress?: string;

  @Expose()
  @IsOptional()
  @ApiPropertyOptional({
    type: Boolean,
    description: 'Marcar este dispositivo como de confianza',
    example: true,
  })
  trustDevice?: boolean;

  @Expose()
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    type: String,
    description: 'Fingerprint único del dispositivo',
    example: 'a1b2c3d4e5f6g7h8i9j0',
  })
  deviceFingerprint?: string;
}

export class Disable2FAInput {
  @Expose()
  @IsDefined()
  @IsString()
  @MinLength(8)
  @ApiProperty({
    type: String,
    description: 'Contraseña actual para confirmar la desactivación de 2FA',
    example: 'Password123!',
  })
  password: string;
}
