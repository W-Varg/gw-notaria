import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsInt, Min, Max } from 'class-validator';

export class TopReseniasQueryDto {
  @ApiPropertyOptional({
    description: 'Número de reseñas a obtener',
    minimum: 1,
    maximum: 20,
    default: 5,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(20)
  cantidad?: number = 5;
}

export class ProductosDestacadosQueryDto {
  @ApiPropertyOptional({
    description: 'Número de productos destacados a obtener',
    minimum: 1,
    maximum: 20,
    default: 6,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(20)
  cantidad?: number = 6;
}
