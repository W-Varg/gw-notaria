import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

// ==================== BASE RESPONSE ====================
export class ResponseNotificacionType {
  @Expose()
  @ApiProperty({ type: String })
  status: string;

  @Expose()
  @ApiProperty({ type: String })
  message: string;

  @Expose()
  @ApiProperty()
  data?: any;
}

// ==================== DETAIL RESPONSE ====================
export class ResponseNotificacionDetailType {
  @Expose()
  @ApiProperty({ type: String })
  status: string;

  @Expose()
  @ApiProperty({ type: String })
  message: string;

  @Expose()
  @ApiProperty()
  data?: any;
}

// ==================== PAGINATED RESPONSE ====================
export class PaginateNotificacionesType {
  @Expose()
  @ApiProperty({ type: String })
  status: string;

  @Expose()
  @ApiProperty({ type: String })
  message: string;

  @Expose()
  @ApiProperty({
    type: 'object',
    properties: {
      count: { type: 'number' },
      next: { type: 'string', nullable: true },
      previous: { type: 'string', nullable: true },
      results: { type: 'array', items: { type: 'object' } },
    },
  })
  data?: {
    count: number;
    next: string | null;
    previous: string | null;
    results: any[];
  };
}

// ==================== DELETE RESPONSE ====================
export class ResponseDeleteNotificacionType {
  @Expose()
  @ApiProperty({ type: String })
  status: string;

  @Expose()
  @ApiProperty({ type: String })
  message: string;
}
