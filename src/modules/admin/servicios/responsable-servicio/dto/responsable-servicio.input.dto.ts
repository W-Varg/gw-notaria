import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsDefined,
  IsInt,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { BaseFilterDto } from 'src/common/dtos/filters.dto';
import { BoolFilter } from 'src/common/dtos/prisma/bool-filter.input';
import { IntFilter } from 'src/common/dtos/prisma/int-filter.input';
import { StringFilter } from 'src/common/dtos/prisma/string-filter.input';

export class CreateResponsableServicioDto {
  @Expose()
  @IsDefined()
  @IsString()
  @ApiProperty({ type: String })
  usuarioId: string;

  @Expose()
  @IsDefined()
  @IsInt()
  @ApiProperty({ type: Number })
  servicioId: string;

  @Expose()
  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({ type: String, format: 'date-time' })
  fechaBaja?: string;

  @Expose()
  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ type: Boolean })
  activo?: boolean;
}

export class UpdateResponsableServicioDto extends PartialType(CreateResponsableServicioDto) {}

class ResponsableServicioWhereInput {
  @Expose()
  @ApiPropertyOptional({ type: StringFilter })
  @IsOptional()
  @Type(() => StringFilter)
  usuarioId?: StringFilter;

  @Expose()
  @ApiPropertyOptional({ type: StringFilter })
  @IsOptional()
  @Type(() => StringFilter)
  servicioId?: StringFilter;

  @Expose()
  @ApiPropertyOptional({ type: BoolFilter })
  @IsOptional()
  @Type(() => BoolFilter)
  activo?: BoolFilter;
}

class ResponsableServicioSelectInput {
  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  id?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  usuarioId?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  servicioId?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  fechaAsignacion?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  fechaBaja?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  activo?: boolean;
}

export class ListResponsableServicioArgsDto extends BaseFilterDto {
  @Expose()
  @ApiPropertyOptional({ type: ResponsableServicioWhereInput })
  @IsOptional()
  @ValidateNested()
  @Type(() => ResponsableServicioWhereInput)
  where?: ResponsableServicioWhereInput;

  @Expose()
  @ApiPropertyOptional({ type: ResponsableServicioSelectInput })
  @IsOptional()
  @ValidateNested()
  @Type(() => ResponsableServicioSelectInput)
  select?: ResponsableServicioSelectInput;
}
