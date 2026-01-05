import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsDefined,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  Min,
  ValidateNested,
} from 'class-validator';
import { BaseFilterDto } from 'src/common/dtos/filters.dto';
import { IntFilter } from 'src/common/dtos/prisma/int-filter.input';
import { IntNullableFilter } from 'src/common/dtos/prisma/int-nullable-filter.input';
import { FloatFilter } from 'src/common/dtos/prisma/float-filter.input';
import { MetodoPagoEnum } from 'src/enums/metodo-pago.enum';

export class CreateTransaccionesEgresosDto {
  @Expose()
  @IsDefined()
  @IsInt()
  @ApiProperty({ type: Number })
  gastoId: number;

  @Expose()
  @IsDefined()
  @IsNumber()
  @Min(0)
  @ApiProperty({ type: Number })
  monto: number;

  @Expose()
  @IsOptional()
  @IsInt()
  @ApiPropertyOptional({ type: Number })
  cuentaBancariaId?: number;

  @Expose()
  @IsDefined()
  @IsEnum(MetodoPagoEnum)
  @ApiProperty({ enum: MetodoPagoEnum })
  metodoPago: MetodoPagoEnum;
}

export class UpdateTransaccionesEgresosDto extends PartialType(CreateTransaccionesEgresosDto) {}

class TransaccionesEgresosWhereInput {
  @Expose()
  @ApiPropertyOptional({ type: IntFilter })
  @IsOptional()
  @Type(() => IntFilter)
  gastoId?: IntFilter;

  @Expose()
  @ApiPropertyOptional({ type: FloatFilter })
  @IsOptional()
  @Type(() => FloatFilter)
  monto?: FloatFilter;

  @Expose()
  @ApiPropertyOptional({ type: IntNullableFilter })
  @IsOptional()
  @Type(() => IntNullableFilter)
  cuentaBancariaId?: IntNullableFilter;

  @Expose()
  @ApiPropertyOptional({ enum: MetodoPagoEnum })
  @IsOptional()
  @IsEnum(MetodoPagoEnum)
  metodoPago?: MetodoPagoEnum;
}

class TransaccionesEgresosSelectInput {
  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  id?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  gastoId?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  monto?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  fecha?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  cuentaBancariaId?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  metodoPago?: boolean;
}

export class ListTransaccionesEgresosArgsDto extends BaseFilterDto {
  @Expose()
  @ApiPropertyOptional({ type: TransaccionesEgresosWhereInput })
  @IsOptional()
  @ValidateNested()
  @Type(() => TransaccionesEgresosWhereInput)
  where?: TransaccionesEgresosWhereInput;

  @Expose()
  @ApiPropertyOptional({ type: TransaccionesEgresosSelectInput })
  @IsOptional()
  @ValidateNested()
  @Type(() => TransaccionesEgresosSelectInput)
  select?: TransaccionesEgresosSelectInput;
}
