import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Empleado } from '../empleado.entity';
import { ApiOkResponseDto, ResponseStructDTO } from 'src/common/dtos/response.dto';
import { Usuario } from '../../usuarios/usuario.entity';
import { SucursalEntity } from 'src/modules/admin/catalogos/sucursales/sucursal.entity';

class EmpleadoData extends OmitType(ResponseStructDTO, ['pagination']) {
  @ApiProperty({ type: Empleado })
  data: Empleado;
}

export class ResponseEmpleadoType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: EmpleadoData })
  declare response: EmpleadoData;
}

/* ------------------------------------------------------------------------------------------------------------------ */
class EmpleadoDetailData {
  @ApiProperty({ type: Empleado })
  data: Empleado;
}

export class ResponseEmpleadoDetailType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: EmpleadoDetailData })
  declare response: EmpleadoDetailData;
}

/* ------------------------------------------------------------------------------------------------------------------ */

class EmpleadosData {
  @ApiProperty({ type: [Empleado] })
  data?: Empleado[];
}

export class ResponseEmpleadosType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: EmpleadosData })
  declare response: EmpleadosData;
}

/* ------------------------------------------------------------------------------------------------------------------ */

class PaginateEmpleadosData extends OmitType(ResponseStructDTO, ['validationErrors']) {
  @ApiProperty({ type: [Empleado] })
  data?: Empleado[];
}

export class PaginateEmpleadosType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: PaginateEmpleadosData })
  declare response: PaginateEmpleadosData;
}

// export class AssignSucursalResponseDto {
//   @ApiProperty({ type: EmpleadoResponseDto })
//   data: EmpleadoResponseDto;

//   @ApiProperty({ example: 'Sucursal asignada exitosamente' })
//   message: string;
// }
