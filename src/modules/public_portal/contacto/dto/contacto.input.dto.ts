import { IsString, IsEmail, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { Expose } from 'class-transformer';

export class ContactoMensajeDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @Expose()
  nombre: string;

  @IsEmail()
  @IsNotEmpty()
  @Expose()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @Expose()
  asunto: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  @Expose()
  mensaje: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  @Expose()
  telefono?: string;
}
