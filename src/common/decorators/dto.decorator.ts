import { SetMetadata, applyDecorators } from '@nestjs/common';
import { ClassTransformOptions } from '@nestjs/common/interfaces/external/class-transform-options.interface';

export const DTO_PIPE_PLAIN_TO_CLASS_OPTIONS = 'dto-pipe-class-transform-options';

export const DtoPipePlainToClassOptions = (plainToClassOptions: ClassTransformOptions = {}) => {
  return applyDecorators(SetMetadata(DTO_PIPE_PLAIN_TO_CLASS_OPTIONS, plainToClassOptions));
};
