import { Expose, Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsArray, ValidateNested, IsIn } from 'class-validator';
import { CrearVentaDetalleDto } from './crer-venta-detalle.input';
import { TIPO_COMPROBANTE } from '../constants/tipo-comprobante.const';
import { ApiProperty } from '@nestjs/swagger';

export class CrearVentaInput {
  @ApiProperty({ required: true, enum: Object.values(TIPO_COMPROBANTE) })
  @Expose()
  @IsNotEmpty()
  @IsIn(Object.values(TIPO_COMPROBANTE))
  tipoComprobante: (typeof TIPO_COMPROBANTE)[keyof typeof TIPO_COMPROBANTE];

  @ApiProperty({ required: true })
  @Expose()
  @IsString()
  @IsNotEmpty()
  clienteId: string;

  @ApiProperty({ required: true, isArray: true, type: CrearVentaDetalleDto })
  @Expose()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CrearVentaDetalleDto)
  detalles: CrearVentaDetalleDto[];
}
