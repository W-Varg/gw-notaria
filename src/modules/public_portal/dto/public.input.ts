import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
  Max,
  MaxLength,
} from 'class-validator';

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                    Contacto DTOs                                                   */
/* ------------------------------------------------------------------------------------------------------------------ */

export class ContactoMensajeDto {
  @ApiProperty({ description: 'Nombre del remitente', example: 'Juan Pérez' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @Expose()
  nombre: string;

  @ApiProperty({ description: 'Email del remitente', example: 'juan@email.com' })
  @IsEmail()
  @IsNotEmpty()
  @Expose()
  email: string;

  @ApiProperty({ description: 'Asunto del mensaje', example: 'Consulta sobre productos' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @Expose()
  asunto: string;

  @ApiProperty({
    description: 'Contenido del mensaje',
    example: 'Necesito información sobre...',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  @Expose()
  mensaje: string;

  @ApiPropertyOptional({ description: 'Teléfono del remitente', example: '123456789' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  @Expose()
  telefono?: string;
}

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                 Información DTOs                                                   */
/* ------------------------------------------------------------------------------------------------------------------ */

export class FAQsDto {
  @ApiPropertyOptional({
    description: 'Categoría de FAQs',
    example: 'productos',
    enum: ['productos', 'envios', 'pagos', 'devoluciones', 'general'],
  })
  @IsOptional()
  @IsString()
  @Expose()
  categoria?: string;

  @ApiPropertyOptional({
    description: 'Límite de resultados',
    type: Number,
    minimum: 1,
    maximum: 100,
    default: 20,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  @Expose()
  limit?: number;
}
