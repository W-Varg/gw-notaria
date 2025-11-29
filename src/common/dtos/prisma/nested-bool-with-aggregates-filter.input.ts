import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { NestedIntFilter } from './nested-int-filter.input';
import { NestedBoolFilter } from './nested-bool-filter.input';

export class NestedBoolWithAggregatesFilter {
  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  equals?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: () => NestedBoolWithAggregatesFilter })
  not?: NestedBoolWithAggregatesFilter;

  @Expose()
  @ApiPropertyOptional({ type: () => NestedIntFilter })
  _count?: NestedIntFilter;

  @Expose()
  @ApiPropertyOptional({ type: () => NestedBoolFilter })
  _min?: NestedBoolFilter;

  @Expose()
  @ApiPropertyOptional({ type: () => NestedBoolFilter })
  _max?: NestedBoolFilter;
}
