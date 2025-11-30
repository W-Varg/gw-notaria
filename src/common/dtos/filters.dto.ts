import { ApiProperty, ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import { Expose, Transform, TransformFnParams } from 'class-transformer';
import { IsDateString, IsIn, IsInt, IsISO8601, IsOptional, IsString, Max, Min } from 'class-validator';
import { smsIsDate } from 'src/helpers/validator.sms';

export class PaginationQueryDto {
  @Expose()
  @ApiPropertyOptional({ required: false, description: 'Página iniciando en 1', default: 0 })
  @Transform(({ value }: TransformFnParams) => (value && !isNaN(value) ? Number(value) : value))
  @IsOptional()
  @Min(0)
  @Expose()
  page?: number;

  @Expose()
  @ApiPropertyOptional({ required: false, description: 'Tamaño de página', default: 10 })
  @Transform(({ value }: TransformFnParams) => (value && !isNaN(value) ? Number(value) : value))
  @IsOptional()
  @Min(1)
  @Max(1000)
  @Expose()
  size?: number;
}

export class OrderQueryDto {
  @Expose()
  @ApiPropertyOptional({ required: false, description: 'Campo por el cual ordenar' })
  @IsOptional()
  @IsString()
  @Expose()
  orderBy?: string;

  @Expose()
  @ApiPropertyOptional({
    required: false,
    enum: ['asc', 'desc'],
    description: 'Dirección de orden',
  })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  @Expose()
  orderDirection?: 'asc' | 'desc';
}

export class DateRangeQueryDto {
  @Expose()
  @IsISO8601({ strict: true }, { message: (v) => smsIsDate(v) })
  @ApiPropertyOptional({ required: false, description: 'Fecha desde (ISO 8601)' })
  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @Expose()
  @IsISO8601({ strict: true }, { message: (v) => smsIsDate(v) })
  @ApiProperty({ required: false, description: 'Fecha hasta (ISO 8601)' })
  @IsOptional()
  @IsDateString()
  toDate?: string;
}

export class BaseFilterDto extends IntersectionType(PaginationQueryDto, OrderQueryDto) { }

export class ListFindAllQueryDto extends IntersectionType(PaginationQueryDto, OrderQueryDto) { }
