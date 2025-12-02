import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { TokenAuthGuard, validateAppToken, ValidateTokenOptions } from '../guards/token-auth.guard';
import { PermissionsGuard, RequiredPermissions } from '../guards/permision.guard';

export const BearerAuthPermision = (permissions: string[] = [], options?: ValidateTokenOptions) => {
  const decorators = [ApiBearerAuth(), UseGuards(TokenAuthGuard, PermissionsGuard)];

  if (permissions && permissions.length > 0) {
    decorators.push(RequiredPermissions(...permissions));
  }

  decorators.push(validateAppToken(options));

  return applyDecorators(...decorators);
};

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                 security decorators                                                */
/* ------------------------------------------------------------------------------------------------------------------ */
export const BearerAuthToken = () => {
  return applyDecorators(ApiBearerAuth(), UseGuards(TokenAuthGuard));
};
