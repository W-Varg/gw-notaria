import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { EstadoEntrega } from '../../../enums/estado-entrega.enum';
import { NestedEnumEstadoEntregaFilter } from './nested-enum-estado-entrega-filter.input';
import { IsArray, IsEnum } from 'class-validator';

export class EnumEstadoEntregaFilter {
  @Expose()
  @ApiPropertyOptional({ enum: EstadoEntrega })
  @IsEnum(EstadoEntrega)
  equals?: EstadoEntrega;

  @Expose()
  @ApiPropertyOptional({ enum: EstadoEntrega, isArray: true })
  @IsArray()
  @IsEnum(EstadoEntrega, { each: true })
  in?: Array<EstadoEntrega>;

  @Expose()
  @ApiPropertyOptional({ enum: EstadoEntrega, isArray: true })
  @IsArray()
  @IsEnum(EstadoEntrega, { each: true })
  notIn?: Array<EstadoEntrega>;

  @Expose()
  @ApiPropertyOptional({ type: () => NestedEnumEstadoEntregaFilter })
  not?: NestedEnumEstadoEntregaFilter;
}
