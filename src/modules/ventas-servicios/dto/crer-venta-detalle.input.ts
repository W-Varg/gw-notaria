import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CrearVentaDetalleDto {
  @ApiProperty({ required: true })
  @Expose()
  @IsString()
  @IsNotEmpty()
  servicioId: string;

  @ApiProperty({ required: true, type: Number })
  @Expose()
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  cantidad: number;

  @ApiProperty({ required: true, type: Number })
  @Expose()
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  precio: number;

  @ApiProperty({ required: false, type: Number })
  @Expose()
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  descuento: number;
}
