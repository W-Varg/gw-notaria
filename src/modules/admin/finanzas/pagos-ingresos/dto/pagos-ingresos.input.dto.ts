import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsDefined,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { BaseFilterDto } from '../../../../../common/dtos/filters.dto';
import { IntNullableFilter } from '../../../../../common/dtos/prisma/int-nullable-filter.input';
import { StringNullableFilter } from '../../../../../common/dtos/prisma/string-nullable-filter.input';
import { FloatFilter } from '../../../../../common/dtos/prisma/float-filter.input';
import { MetodoPagoEnum } from '../../../../../enums/metodo-pago.enum';
import { ConstanciaEnum } from '../../../../../generated/prisma/enums';

export class CreatePagosIngresosDto {
  @Expose()
  @IsOptional()
  @ApiPropertyOptional()
  servicioId?: string;

  @Expose()
  @IsDefined()
  @IsNumber()
  @Min(0)
  @ApiProperty({ type: Number })
  monto: number;

  @Expose()
  @IsDefined()
  @IsInt()
  @ApiProperty({
    type: Number,
    enum: MetodoPagoEnum,
    description: '1 = EFECTIVO, 2 = QR, 3 = TRANSFERENCIA, 4 = CHEQUE, 5 = DEPOSITO',
  })
  tipoPago: MetodoPagoEnum;

  @Expose()
  @IsOptional()
  @IsInt()
  @ApiPropertyOptional({ type: Number })
  cuentaBancariaId?: number;

  @Expose()
  @IsOptional()
  @IsEnum(ConstanciaEnum)
  @ApiPropertyOptional({ enum: ConstanciaEnum })
  constanciaTipo?: ConstanciaEnum;

  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(50)
  @ApiPropertyOptional({ type: String })
  numeroConstancia?: string;

  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  @ApiPropertyOptional({ type: String })
  concepto?: string;

  @Expose()
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  usuarioRegistroId?: string;
}

export class UpdatePagosIngresosDto extends PartialType(CreatePagosIngresosDto) {}

class PagosIngresosWhereInput {
  @Expose()
  @ApiPropertyOptional({ type: StringNullableFilter })
  @IsOptional()
  @Type(() => StringNullableFilter)
  servicioId?: StringNullableFilter;

  @Expose()
  @ApiPropertyOptional({ type: FloatFilter })
  @IsOptional()
  @Type(() => FloatFilter)
  monto?: FloatFilter;

  @Expose()
  @ApiPropertyOptional({ enum: MetodoPagoEnum })
  @IsOptional()
  @IsEnum(MetodoPagoEnum)
  tipoPago?: MetodoPagoEnum;

  @Expose()
  @ApiPropertyOptional({ type: IntNullableFilter })
  @IsOptional()
  @Type(() => IntNullableFilter)
  cuentaBancariaId?: IntNullableFilter;

  @Expose()
  @ApiPropertyOptional({ enum: ConstanciaEnum })
  @IsOptional()
  @IsEnum(ConstanciaEnum)
  constanciaTipo?: ConstanciaEnum;

  @Expose()
  @ApiPropertyOptional({ type: StringNullableFilter })
  @IsOptional()
  @Type(() => StringNullableFilter)
  numeroConstancia?: StringNullableFilter;

  @Expose()
  @ApiPropertyOptional({ type: StringNullableFilter })
  @IsOptional()
  @Type(() => StringNullableFilter)
  usuarioRegistroId?: StringNullableFilter;
}

class PagosIngresosSelectInput {
  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  id?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  servicioId?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  fecha?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  monto?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  tipoPago?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  cuentaBancariaId?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  constanciaTipo?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  numeroConstancia?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  concepto?: boolean;
}

export class ListPagosIngresosArgsDto extends BaseFilterDto {
  @Expose()
  @ApiPropertyOptional({ type: PagosIngresosWhereInput })
  @IsOptional()
  @ValidateNested()
  @Type(() => PagosIngresosWhereInput)
  where?: PagosIngresosWhereInput;

  @Expose()
  @ApiPropertyOptional({ type: PagosIngresosSelectInput })
  @IsOptional()
  @ValidateNested()
  @Type(() => PagosIngresosSelectInput)
  select?: PagosIngresosSelectInput;
}
