import { ApiProperty, OmitType } from '@nestjs/swagger';
import { ApiOkResponseDto, ResponseStructDTO } from 'src/common/dtos/response.dto';
import { ArqueosDiarios } from '../arqueos-diarios.entity';

class ArqueosDiariosData extends OmitType(ResponseStructDTO, ['pagination']) {
  @ApiProperty({ type: ArqueosDiarios })
  data: ArqueosDiarios;
}

export class ResponseArqueosDiariosType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: ArqueosDiariosData })
  declare response: ArqueosDiariosData;
}

export class ResponseArqueosDiariosDetailType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: ArqueosDiariosData })
  declare response: ArqueosDiariosData;
}

class ListArqueosDiariosData {
  @ApiProperty({ type: [ArqueosDiarios] })
  data?: ArqueosDiarios[];
}

export class ResponseListArqueosDiariosType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: ListArqueosDiariosData })
  declare response: ListArqueosDiariosData;
}

class PaginateArqueosDiariosData extends OmitType(ResponseStructDTO, ['validationErrors']) {
  @ApiProperty({ type: [ArqueosDiarios] })
  data?: ArqueosDiarios[];
}

export class PaginateArqueosDiariosType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: PaginateArqueosDiariosData })
  declare response: PaginateArqueosDiariosData;
}
