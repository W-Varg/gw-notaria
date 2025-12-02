import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsString,
  MaxLength,
  MinLength,
  IsDefined,
  IsOptional,
  ValidateNested,
  IsBoolean,
  IsNumber,
} from 'class-validator';
import { BaseFilterDto } from 'src/common/dtos/filters.dto';
import { StringFilter } from 'src/common/dtos/prisma/string-filter.input';

export class CreateCuentaBancariaDto {
  @Expose()
  @IsDefined()
  @IsNumber()
  @ApiProperty({ type: Number })
  bancoId: number;

  @Expose()
  @IsDefined()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  @ApiProperty({ type: String })
  numeroCuenta: string;

  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(50)
  @ApiPropertyOptional({ type: String })
  tipoCuenta?: string;

  @Expose()
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  saldoActual?: string;
}

export class UpdateCuentaBancariaDto extends PartialType(CreateCuentaBancariaDto) {}

class CuentaBancariaWhereInput {
  @Expose()
  @ApiPropertyOptional({ type: StringFilter })
  @IsOptional()
  @Type(() => StringFilter)
  numeroCuenta?: StringFilter;

  @Expose()
  @ApiPropertyOptional({ type: StringFilter })
  @IsOptional()
  @Type(() => StringFilter)
  tipoCuenta?: StringFilter;
}

class CuentaBancariaSelectInput {
  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsBoolean()
  id?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsBoolean()
  bancoId?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsBoolean()
  numeroCuenta?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsBoolean()
  tipoCuenta?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsBoolean()
  saldoActual?: boolean;
}

export class ListCuentaBancariaArgsDto extends BaseFilterDto {
  @Expose()
  @ApiPropertyOptional({ type: CuentaBancariaWhereInput })
  @IsOptional()
  @ValidateNested()
  @Type(() => CuentaBancariaWhereInput)
  where?: CuentaBancariaWhereInput;

  @Expose()
  @ApiPropertyOptional({ type: CuentaBancariaSelectInput })
  @IsOptional()
  @ValidateNested()
  @Type(() => CuentaBancariaSelectInput)
  select?: CuentaBancariaSelectInput;
}
