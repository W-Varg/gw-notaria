import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString, IsOptional, MaxLength, MinLength, IsDefined, IsNotEmpty } from 'class-validator';

/**
 * DTO para actualizar perfil de usuario
 */
export class UpdateProfileInput {
  @Expose()
  @ApiProperty({ description: 'Nombre del usuario', example: 'Juan', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  nombre?: string;

  @Expose()
  @ApiProperty({ description: 'Apellidos del usuario', example: 'Pérez García', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  apellidos?: string;

  @Expose()
  @ApiProperty({ description: 'Teléfono del usuario', example: '70123456', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  telefono?: string;

  @Expose()
  @ApiProperty({ description: 'Dirección del usuario', required: false })
  @IsOptional()
  @IsString()
  direccion?: string;
}

/**
 * DTO para verificar contraseña
 */
export class VerifyPasswordInput {
  @Expose()
  @ApiProperty({ description: 'Contraseña a verificar', example: 'Password123!' })
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
