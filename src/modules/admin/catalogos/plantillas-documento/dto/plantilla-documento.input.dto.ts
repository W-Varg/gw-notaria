import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDefined,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { BaseFilterDto } from '../../../../../common/dtos/filters.dto';
import { BoolFilter } from '../../../../../common/dtos/prisma/bool-filter.input';
import { StringFilter } from '../../../../../common/dtos/prisma/string-filter.input';
import { StringNullableFilter } from '../../../../../common/dtos/prisma/string-nullable-filter.input';

export class CreatePlantillaDocumentoDto {
  @Expose()
  @IsDefined()
  @IsString()
  @ApiProperty({ type: String })
  tipoDocumentoId: string;

  @Expose()
  @IsDefined()
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  @ApiProperty({ type: String })
  nombrePlantilla: string;

  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  @ApiPropertyOptional({ type: String })
  descripcion?: string;

  @Expose()
  @IsDefined()
  @IsString()
  @ApiProperty({ type: String })
  contenidoHtml: string;

  @Expose()
  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ type: Boolean })
  estaActiva?: boolean;
}

export class UpdatePlantillaDocumentoDto extends PartialType(CreatePlantillaDocumentoDto) {}

class PlantillaDocumentoWhereInput {
  @Expose()
  @ApiPropertyOptional({ type: StringFilter })
  @IsOptional()
  @Type(() => StringFilter)
  tipoDocumentoId?: StringFilter;

  @Expose()
  @ApiPropertyOptional({ type: StringFilter })
  @IsOptional()
  @Type(() => StringFilter)
  nombrePlantilla?: StringFilter;

  @Expose()
  @ApiPropertyOptional({ type: StringNullableFilter })
  @IsOptional()
  @Type(() => StringNullableFilter)
  descripcion?: StringNullableFilter;

  @Expose()
  @ApiPropertyOptional({ type: BoolFilter })
  @IsOptional()
  @Type(() => BoolFilter)
  estaActiva?: BoolFilter;
}

class PlantillaDocumentoSelectInput {
  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsBoolean()
  id?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsBoolean()
  tipoDocumentoId?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsBoolean()
  nombrePlantilla?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsBoolean()
  descripcion?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsBoolean()
  contenidoHtml?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsBoolean()
  estaActiva?: boolean;
}

export class ListPlantillaDocumentoArgsDto extends BaseFilterDto {
  @Expose()
  @ApiPropertyOptional({ type: PlantillaDocumentoWhereInput })
  @IsOptional()
  @ValidateNested()
  @Type(() => PlantillaDocumentoWhereInput)
  where?: PlantillaDocumentoWhereInput;

  @Expose()
  @ApiPropertyOptional({ type: PlantillaDocumentoSelectInput })
  @IsOptional()
  @ValidateNested()
  @Type(() => PlantillaDocumentoSelectInput)
  select?: PlantillaDocumentoSelectInput;
}
