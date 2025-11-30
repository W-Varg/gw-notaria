import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsDefined, IsOptional, IsString, MaxLength, ValidateNested } from 'class-validator';
import { BaseFilterDto } from 'src/common/dtos/filters.dto';
import { StringFilter } from 'src/common/dtos/prisma/string-filter.input';

export class CreateTipoProductoDto {
  @Expose()
  @IsDefined()
  @IsString()
  @MaxLength(120)
  @ApiProperty({ type: String })
  @Expose()
  nombre: string;
}

export class UpdateTipoProductoDto extends PartialType(CreateTipoProductoDto) {
  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(120)
  @ApiPropertyOptional({ type: String })
  @Expose()
  nombre?: string;
}

class TipoProductoWhereInput {
  @Expose()
  @ApiPropertyOptional({ type: StringFilter })
  @IsOptional()
  @Type(() => StringFilter)
  @Expose()
  nombre?: StringFilter;
}

class TipoProductoSelectInput {
  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  @Expose()
  id?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  @Expose()
  nombre?: boolean;
}

export class ListTipoProductoArgsDto extends BaseFilterDto {
  @Expose()
  @ApiPropertyOptional({ type: TipoProductoWhereInput })
  @IsOptional()
  @ValidateNested()
  @Type(() => TipoProductoWhereInput)
  @Expose()
  where?: TipoProductoWhereInput;

  @Expose()
  @ApiPropertyOptional({ type: TipoProductoSelectInput })
  @IsOptional()
  @ValidateNested()
  @Type(() => TipoProductoSelectInput)
  @Expose()
  select?: TipoProductoSelectInput;
}
