import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { UnidadMedida } from '../../../enums/unidad-medida.enum';
import { IsArray, IsEnum } from 'class-validator';

export class NestedEnumUnidadMedidaFilter {
  @Expose()
  @ApiPropertyOptional({ enum: UnidadMedida })
  @IsEnum(UnidadMedida)
  equals?: UnidadMedida;

  @Expose()
  @ApiPropertyOptional({ enum: UnidadMedida, isArray: true })
  @IsArray()
  @IsEnum(UnidadMedida, { each: true })
  in?: Array<UnidadMedida>;

  @Expose()
  @ApiPropertyOptional({ enum: UnidadMedida, isArray: true })
  @IsArray()
  @IsEnum(UnidadMedida, { each: true })
  notIn?: Array<UnidadMedida>;

  @Expose()
  @ApiPropertyOptional({ type: () => NestedEnumUnidadMedidaFilter })
  not?: NestedEnumUnidadMedidaFilter;
}
