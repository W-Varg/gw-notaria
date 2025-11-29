import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { NestedBoolFilter } from './nested-bool-filter.input';

export class BoolFilter {
  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  equals?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: () => NestedBoolFilter })
  not?: NestedBoolFilter;
}
