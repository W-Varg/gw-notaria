import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString, IsOptional, IsNumber, Min, Max } from 'class-validator';

export class FAQsDto {
  @Expose()
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  @Expose()
  categoria?: string;

  @Expose()
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  @ApiPropertyOptional({ type: Number, minimum: 1, maximum: 100, default: 20 })
  @Expose()
  limit?: number;
}
