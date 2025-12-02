import { ApiProperty, ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import { IsOptional, IsBoolean } from 'class-validator';
import { OrderQueryDto, PaginationQueryDto } from 'src/common/dtos/filters.dto';
import { BoolFilter } from 'src/common/dtos/prisma/bool-filter.input';
import { Expose, Type } from 'class-transformer';
import { StringNullableFilter } from 'src/common/dtos/prisma/string-nullable-filter.input';
import { StringFilter } from 'src/common/dtos/prisma/string-filter.input';

export class UpdatePermisoActivoDto {
  @Expose()
  @ApiProperty({ type: Boolean, description: 'Estado activo del permiso' })
  @IsBoolean()
  @Expose()
  estaActivo: boolean;
}

class PermisoWhereInput {
  @Expose()
  @ApiPropertyOptional({ type: StringFilter })
  @IsOptional()
  @Type(() => StringFilter)
  @Expose()
  nombre?: StringFilter;

  @Expose()
  @ApiPropertyOptional({ type: StringNullableFilter })
  @IsOptional()
  @Type(() => StringNullableFilter)
  @Expose()
  modulo?: StringNullableFilter;

  @Expose()
  @ApiPropertyOptional({ type: BoolFilter })
  @IsOptional()
  @Type(() => BoolFilter)
  @Expose()
  estaActivo?: BoolFilter;

  @Expose()
  @ApiPropertyOptional({ type: StringNullableFilter })
  @IsOptional()
  @Type(() => StringNullableFilter)
  @Expose()
  accion?: StringNullableFilter;
}

export class ListPermisosArgsDto extends IntersectionType(PaginationQueryDto, OrderQueryDto) {
  @Expose()
  @ApiProperty({ required: false, type: PermisoWhereInput })
  @IsOptional()
  @Expose()
  where?: PermisoWhereInput;
}
