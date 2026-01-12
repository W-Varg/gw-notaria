import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsDateString, IsInt, IsOptional } from 'class-validator';

export class FiltroInputDto {
  @ApiProperty({ required: false })
  @Expose()
  @IsOptional()
  @IsDateString({ strict: true })
  fecha?: string; // 2020-12-11

  @ApiProperty({ required: false })
  @Expose()
  @IsOptional()
  @IsInt()
  bancoId?: number;
}
