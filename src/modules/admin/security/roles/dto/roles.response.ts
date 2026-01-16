import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Role, RoleDetail } from '../role.entity';
import { ApiOkResponseDto, ResponseStructDTO } from '../../../../../common/dtos/response.dto';

class RolData extends OmitType(ResponseStructDTO, ['pagination']) {
  @ApiProperty({ type: Role })
  data: Role;
}

export class ResponseRolType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: RolData })
  declare response: RolData;
}

/* ------------------------------------------------------------------------------------------------------------------ */
class RolDetailData {
  @ApiProperty({ type: RoleDetail })
  data: RoleDetail;
}

export class ResponseRolDetailType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: RolDetailData })
  declare response: RolDetailData;
}
/* ------------------------------------------------------------------------------------------------------------------ */

class RolesData {
  @ApiProperty({ type: [Role] })
  data?: Role[];
}

export class ResponseRolesType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: RolesData })
  declare response: RolesData;
}

/* ------------------------------------------------------------------------------------------------------------------ */

class PaginateRolesData extends OmitType(ResponseStructDTO, ['validationErrors']) {
  @ApiProperty({ type: [Role] })
  data?: Role[];
}

export class PaginateRolesType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: PaginateRolesData })
  declare response: PaginateRolesData;
}
