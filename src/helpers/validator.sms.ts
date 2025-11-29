import { ValidationArguments, ValidationError } from 'class-validator';
import { ResponseDTO, ValidationErrorsType } from 'src/common/dtos/response.dto';

export const smsMin = (field) => `valor de  ${field} no válido`;

export const smsMinStr = (field: string) => `valor de  ${field} no válido`;

export const requiredFile = (field: string) => `Debe incluir un ${field}`;

export const smsBase64 = (args: ValidationArguments, fieldName: string = null) =>
  `${fieldName ?? '$property'} debe estar codificado en base64`;

export const smsArrayNotSelect = (field: string) => `Debe seleccionar al menos ${field}`;
export const smsArrayNotEmpty = (field: string) => `Debe contener al menos ${field}`;

/**
 * example a ENUM => enum PaperSize { Letter = 'Letter', Legal = 'Legal', A3 = 'A3', Tabloid = 'Tabloid'}
 * @param args ValidationArguments
 * @returns string
 */
export const smsEnum = (args: ValidationArguments) => {
  if (Array.isArray(args.constraints)) {
    const arrayData = args.constraints[1]?.join(', ');
    return `'$value' no válido para $property, admite solo '${arrayData}'`;
  }
  return `$property no admite el valor '$value'`;
};

export const smsIsString = (args: ValidationArguments, fieldName: string = null) => {
  return `El ${fieldName ?? '$property'} ingresado no es válido. Por favor, ingrese solo texto.`;
};

export const smsIsStringM = (args: ValidationArguments, fieldName: string = null) => {
  return `El ${fieldName ?? '$property'} ingresado no es válido. Por favor, ingrese solo texto.`;
};

export const smsIsStringF = (args: ValidationArguments, fieldName: string = null) => {
  return `La ${fieldName ?? '$property'} ingresada no es válido. Por favor, ingrese solo texto.`;
};

export const smsIsDate = (args: ValidationArguments, fieldName: string = null) => {
  return `${fieldName ?? '$property'} ingresado no es válido. Por favor, ingrese un formato de fecha valido.`;
};

export const smsIsDateM = (args: ValidationArguments, fieldName: string = null) => {
  return `El ${fieldName ?? '$property'} ingresado no es válido. Por favor, ingrese un formato de fecha valido.`;
};

export const smsIsDateF = (args: ValidationArguments, fieldName: string = null) => {
  return `La ${fieldName ?? '$property'} ingresado no es válido. Por favor, ingrese un formato de fecha valido.`;
};

export const smsIsBoolean = (args: ValidationArguments, fieldName: string = null) => {
  return `El ${fieldName ?? '$property'} ingresado no es válido. Por favor, ingrese un valor binario.`;
};

export const smsNotEmpty = () => {
  return `Este campo no puede estar vacío`;
};

export const smsNotEmptyM = (args: ValidationArguments, fieldName: string = null) => {
  return `El ${fieldName ?? '$property'} no puede estar vacío`;
};

export const smsNotEmptyF = (args: ValidationArguments, fieldName: string = null) => {
  return `La ${fieldName ?? '$property'} no puede estar vacío`;
};

export const smsMinLength = (args: ValidationArguments, fieldName: string = null) => {
  return `valor de ${fieldName ?? '$property'} muy corto, debe ser mayor a ${args.constraints[0]} carácteres`;
};

export const smsMaxLength = (args: ValidationArguments, fieldName: string = null) =>
  `${fieldName ?? '$property'} muy largo, no debe ser mayor a ${args.constraints[0]} carácteres`;

export const smsMinInt = (args: ValidationArguments, fieldName: string = null) =>
  `${fieldName ?? '$property'} debe ser mayor o igual a ${args.constraints[0]}`;

export const smsMaxInt = (args: ValidationArguments) =>
  `$property debe ser menor o igual a ${args.constraints[0]}`;

export const smsLength = (args: ValidationArguments, fieldName: string = null) => {
  return `${fieldName ?? '$property'} debe tener entre ${args.constraints[0]} y ${args.constraints[1]} caracteres.`;
};

export const smsInteger = (args: ValidationArguments, fieldName: string = null) => {
  return `${fieldName ?? '$property'} debe ser un numero`;
};

export const smsDateString = (args: ValidationArguments, fieldName: string = null) => {
  return `La fecha de ${fieldName ?? '$property'} no esta formato ISO 8601`;
};

export const smsDate = (args: ValidationArguments, fieldName: string = null) => {
  return `${
    fieldName ?? '$property'
  } debe estar en formato ISO (ej. 2001-12-25T04:00:00.000Z ó 2001-12-25T00:00:00.000Z). Por favor, verifique que haya ingresado correctamente.`;
};

/**
 * return a array of message from erros validations
 * @param errors
 * @returns
 */
export const formatValidationErrorsToArraySms = (errors: ValidationError[]) => {
  const messages: string[][] = errors.map((err) => {
    return Object.values(err.constraints);
  });

  return messages.flat(1);
};

// ====================================
// ===SMS WITH VALIDATOR, FieldName ===
// ====================================

/**
 * return a array of message from erros validations
 * @param errors
 * @returns
 */
export const formatValidationErrorsToResponseDto = <T>(
  errors: ValidationError[],
): ResponseDTO<T> => {
  const errorSms: Partial<ValidationErrorsType<T>> = errors.reduce((objErrors, err) => {
    if (err.children.length) {
      const tempDAta = formatValidationErrorsToResponseDto(err.children);
      objErrors[err.property] = tempDAta.response.validationErrors;
    } else {
      objErrors[err.property] = Object.values(err.constraints);
    }
    return { ...objErrors };
  }, {});

  return {
    error: true,
    message: 'hay un error de validación, por favor verifique los datos ingresados',
    response: {
      validationErrors: errorSms as ValidationErrorsType<T>,
    },
    status: 406,
  };
};
