import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, IsOptional, IsEmail, MaxLength, MinLength, IsInt, Min } from 'class-validator';

/**
 * DTO para actualizar perfil de usuario
 */
export class UpdateProfileInput {
  @ApiProperty({ description: 'Nombre del usuario', example: 'Juan', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  nombre?: string;

  @ApiProperty({ description: 'Apellidos del usuario', example: 'Pérez García', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  apellidos?: string;

  @ApiProperty({ description: 'Teléfono del usuario', example: '70123456', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  telefono?: string;

  @ApiProperty({ description: 'Dirección del usuario', required: false })
  @IsOptional()
  @IsString()
  direccion?: string;
}

/**
 * DTO para verificar contraseña
 */
export class VerifyPasswordInput {
  @ApiProperty({ description: 'Contraseña a verificar', example: 'Password123!' })
  @IsString()
  @MinLength(6)
  password: string;
}

/**
 * DTO para reenviar OTP
 */
export class ResendOTPInput {
  @ApiProperty({ description: 'ID del usuario', example: 'cuid123abc' })
  @IsString()
  userId: string;
}

/**
 * DTO para obtener historial de login con paginación
 */
export class GetLoginHistoryInput {
  @ApiProperty({ description: 'Página actual', example: 1, required: false, default: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiProperty({
    description: 'Cantidad de resultados por página',
    example: 10,
    required: false,
    default: 10,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number = 10;
}
