import { ApiProperty, OmitType } from '@nestjs/swagger';
import { ApiOkResponseDto, ResponseStructDTO } from 'src/common/dtos/response.dto';
import { TipoDocumento } from '../tipo-documento.entity';

// Respuesta individual
class TipoDocumentoData extends OmitType(ResponseStructDTO, ['pagination']) {
  @ApiProperty({ type: TipoDocumento })
  data: TipoDocumento;
}

export class ResponseTipoDocumentoType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: TipoDocumentoData })
  declare response: TipoDocumentoData;
}

// Respuesta detallada
export class ResponseTipoDocumentoDetailType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: TipoDocumentoData })
  declare response: TipoDocumentoData;
}

// Respuesta lista simple
class TipoDocumentosData {
  @ApiProperty({ type: [TipoDocumento] })
  data?: TipoDocumento[];
}

export class ResponseTipoDocumentosType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: TipoDocumentosData })
  declare response: TipoDocumentosData;
}

// Respuesta lista paginada
class PaginateTipoDocumentosData extends OmitType(ResponseStructDTO, ['validationErrors']) {
  @ApiProperty({ type: [TipoDocumento] })
  data?: TipoDocumento[];
}

export class PaginateTipoDocumentosType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: PaginateTipoDocumentosData })
  declare response: PaginateTipoDocumentosData;
}
