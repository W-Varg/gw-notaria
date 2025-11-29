import { HttpException } from '@nestjs/common';
import { isNumber } from 'class-validator';
const MapTypes = {
  string: (str: string): string => str,
  boolean: (str: string) => {
    if (str === 'true' || str === 'false') return str === 'true';
    else
      throw new HttpException(
        {
          error: true,
          message: 'El parámetro es de tipo boolean',
          response: null,
          status: 400,
        },
        400,
      );
  },
  number: (str: string) => {
    if (isNumber(Number(str), { allowInfinity: false, allowNaN: false })) return Number(str);
    else
      throw new HttpException(
        {
          error: true,
          message: 'El parámetro es de tipo entero',
          response: null,
          status: 400,
        },
        400,
      );
  },
  object: (value: any) => {
    return value;
  },
};

export const paramTypeValidator = (value: string | undefined, metaType: any) => {
  if (value === undefined && value === null) {
    return value;
  } else {
    return MapTypes[typeof metaType()](value);
  }
};
