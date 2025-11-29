import { IResponse } from '../dtos/response.dto';

export const transformEmptyArray = (value: IResponse) => {
  if (
    value.error === false &&
    Array.isArray(value.response?.data) &&
    value.response.data.length === 0
  ) {
    return {
      error: true,
      message: 'registros no encontrados',
      response: null,
      status: 406,
    };
  }
  return value;
};
