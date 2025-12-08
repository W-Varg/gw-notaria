import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDefined,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { BaseFilterDto } from 'src/common/dtos/filters.dto';
import { BoolFilter } from 'src/common/dtos/prisma/bool-filter.input';
import { StringFilter } from 'src/common/dtos/prisma/string-filter.input';
import { StringNullableFilter } from 'src/common/dtos/prisma/string-nullable-filter.input';
import { FloatFilter } from 'src/common/dtos/prisma/float-filter.input';

export class CreateTipoDocumentoDto {
  @Expose()
  @IsDefined()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  @ApiProperty({ type: String })
  nombre: string;

  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  @ApiPropertyOptional({ type: String })
  descripcion?: string;

  @Expose()
  @IsDefined()
  @IsNumber()
  @Min(0)
  @ApiProperty({ type: Number })
  precioBase: number;

  @Expose()
  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ type: Boolean })
  estaActivo?: boolean;
}

export class UpdateTipoDocumentoDto extends PartialType(CreateTipoDocumentoDto) {}

class TipoDocumentoWhereInput {
  @Expose()
  @ApiPropertyOptional({ type: StringFilter })
  @IsOptional()
  @Type(() => StringFilter)
  nombre?: StringFilter;

  @Expose()
  @ApiPropertyOptional({ type: StringNullableFilter })
  @IsOptional()
  @Type(() => StringNullableFilter)
  descripcion?: StringNullableFilter;

  @Expose()
  @ApiPropertyOptional({ type: FloatFilter })
  @IsOptional()
  @Type(() => FloatFilter)
  precioBase?: FloatFilter;

  @Expose()
  @ApiPropertyOptional({ type: BoolFilter })
  @IsOptional()
  @Type(() => BoolFilter)
  estaActivo?: BoolFilter;
}

class TipoDocumentoSelectInput {
  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsBoolean()
  id?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsBoolean()
  nombre?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsBoolean()
  descripcion?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsBoolean()
  precioBase?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsBoolean()
  estaActivo?: boolean;
}

export class ListTipoDocumentoArgsDto extends BaseFilterDto {
  @Expose()
  @ApiPropertyOptional({ type: TipoDocumentoWhereInput })
  @IsOptional()
  @ValidateNested()
  @Type(() => TipoDocumentoWhereInput)
  where?: TipoDocumentoWhereInput;

  @Expose()
  @ApiPropertyOptional({ type: TipoDocumentoSelectInput })
  @IsOptional()
  @ValidateNested()
  @Type(() => TipoDocumentoSelectInput)
  select?: TipoDocumentoSelectInput;
}
