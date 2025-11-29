import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { EstadoPedido } from '../../../enums/estado-pedido.enum';
import { IsArray, IsEnum } from 'class-validator';

export class NestedEnumEstadoPedidoFilter {
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
  @ApiPropertyOptional({ type: () => NestedEnumEstadoPedidoFilter })
  not?: NestedEnumEstadoPedidoFilter;
}
