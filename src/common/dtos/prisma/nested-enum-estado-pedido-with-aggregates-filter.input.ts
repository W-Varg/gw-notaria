import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { EstadoPedido } from '../../../enums/estado-pedido.enum';
import { NestedIntFilter } from './nested-int-filter.input';
import { NestedEnumEstadoPedidoFilter } from './nested-enum-estado-pedido-filter.input';
import { IsArray, IsEnum } from 'class-validator';

export class NestedEnumEstadoPedidoWithAggregatesFilter {
  @Expose()
  @ApiPropertyOptional({ enum: EstadoPedido })
  @IsEnum(EstadoPedido)
  equals?: EstadoPedido;

  @Expose()
  @ApiPropertyOptional({ enum: EstadoPedido, isArray: true })
  @IsArray()
  @IsEnum(EstadoPedido, { each: true })
  in?: Array<EstadoPedido>;

  @Expose()
  @ApiPropertyOptional({ enum: EstadoPedido, isArray: true })
  @IsArray()
  @IsEnum(EstadoPedido, { each: true })
  notIn?: Array<EstadoPedido>;
  @Expose()
  @ApiPropertyOptional({ type: () => NestedEnumEstadoPedidoWithAggregatesFilter })
  not?: NestedEnumEstadoPedidoWithAggregatesFilter;

  @Expose()
  @ApiPropertyOptional({ type: () => NestedIntFilter })
  _count?: NestedIntFilter;

  @Expose()
  @ApiPropertyOptional({ type: () => NestedEnumEstadoPedidoFilter })
  _min?: NestedEnumEstadoPedidoFilter;

  @Expose()
  @ApiPropertyOptional({ type: () => NestedEnumEstadoPedidoFilter })
  _max?: NestedEnumEstadoPedidoFilter;
}
