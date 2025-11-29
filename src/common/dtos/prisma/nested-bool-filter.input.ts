import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class NestedBoolFilter {
  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  equals?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: () => NestedBoolFilter })
  not?: NestedBoolFilter;
}
