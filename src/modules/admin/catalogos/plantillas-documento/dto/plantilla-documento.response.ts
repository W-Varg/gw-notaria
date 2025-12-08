import { ApiProperty, OmitType } from '@nestjs/swagger';
import { ApiOkResponseDto, ResponseStructDTO } from 'src/common/dtos/response.dto';
import { PlantillaDocumento } from '../plantilla-documento.entity';

class PlantillaDocumentoData extends OmitType(ResponseStructDTO, ['pagination']) {
  @ApiProperty({ type: PlantillaDocumento })
  data: PlantillaDocumento;
}

export class ResponsePlantillaDocumentoType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: PlantillaDocumentoData })
  declare response: PlantillaDocumentoData;
}

export class ResponsePlantillaDocumentoDetailType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: PlantillaDocumentoData })
  declare response: PlantillaDocumentoData;
}

class PlantillaDocumentosData {
  @ApiProperty({ type: [PlantillaDocumento] })
  data?: PlantillaDocumento[];
}

export class ResponsePlantillaDocumentosType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: PlantillaDocumentosData })
  declare response: PlantillaDocumentosData;
}

class PaginatePlantillaDocumentosData extends OmitType(ResponseStructDTO, ['validationErrors']) {
  @ApiProperty({ type: [PlantillaDocumento] })
  data?: PlantillaDocumento[];
}

export class PaginatePlantillaDocumentosType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: PaginatePlantillaDocumentosData })
  declare response: PaginatePlantillaDocumentosData;
}
