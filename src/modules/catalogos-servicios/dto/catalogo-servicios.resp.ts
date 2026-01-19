import { ApiProperty, OmitType } from '@nestjs/swagger';
import { ApiOkResponseDto } from 'src/common/dtos';

class CatalogoServiciosDto {
  @ApiProperty()
  readonly id: number;

  @ApiProperty()
  readonly codigo: string;

  @ApiProperty()
  readonly nombre: string;

  @ApiProperty({ required: false })
  readonly descripcion?: string;

  @ApiProperty()
  readonly precioBase: number;

  @ApiProperty()
  readonly tarifaVariable: boolean;
}

export class CatalogoServiciosResp extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: CatalogoServiciosDto })
  declare response: CatalogoServiciosDto;
}
