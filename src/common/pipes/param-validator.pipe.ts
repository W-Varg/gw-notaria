/* eslint-disable @typescript-eslint/ban-types */
import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { paramTypeValidator } from '../../helpers/validator.functions';
import { ApiBadRequestError } from '../filters/global-exception.filter';

/**
 * Pipe for validate data input in body into mutation or query
 * use mode, us   getOne(@Args('Input', MyValidatorPipe) inputDto: ChangeStatusCompilationInput)
 * use auxiliar method for validate
 */
@Injectable()
export class ParamValidatorPipe implements PipeTransform<any> {
  async transform(value: any, metadata: ArgumentMetadata) {
    const { metatype, type } = metadata;

    // Validación específica para parámetros de ruta (path params)
    if (type === 'param') {
      return this.validatePathParam(value, metatype);
    }

    if (!metatype || this.toValidate(metatype)) {
      return value;
    }

    if (value === undefined || value === null) {
      return value;
    }
    return paramTypeValidator(value, metatype);
  }

  private validatePathParam(value: any, metatype: Function): any {
    // Detectar intentos de SQL injection en parámetros
    if (typeof value === 'string') {
      this.checkSQLInjection(value);

      // Si se espera un string, validar y sanitizar
      if (metatype === String) {
        return this.validateStringParam(value);
      }
    }

    // Si se espera un número, validar que sea un número válido
    if (metatype === Number) {
      return this.validateNumberParam(value);
    }

    return value;
  }

  private checkSQLInjection(value: string): void {
    // Patrones de SQL injection divididos para reducir complejidad
    const sqlKeywords =
      /(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE|UNION|DECLARE|CAST|CONVERT)/gi;
    const sqlSymbols = /(--|;|\/\*|\*\/|xp_|sp_)/gi;
    const dangerousChars = /['<>&|\\]/gi;

    if (sqlKeywords.test(value) || sqlSymbols.test(value) || dangerousChars.test(value)) {
      throw new ApiBadRequestError(
        'valor de parámetro inválido, por favor verifique los datos ingresados',
        400,
        null,
        true,
      );
    }
  }

  private validateStringParam(value: string): string {
    // Limitar longitud para prevenir ataques de buffer overflow
    if (value.length > 191) {
      throw new ApiBadRequestError(
        'el parametro no debe exceder los 191 caracteres',
        400,
        null,
        true,
      );
    }

    // Validar que no contenga secuencias de escape peligrosas (null bytes, etc)
    const escapeSequences = /(\\x|\\u|%00|%27|%22)/gi;
    if (escapeSequences.test(value)) {
      throw new ApiBadRequestError(
        'el parametro contiene secuencias inválidas, por favor verifique los datos ingresados',
        400,
        null,
        true,
      );
    }

    // Retornar el string limpio (trim)
    return value.trim();
  }

  private validateNumberParam(value: any): number {
    const numValue = Number(value);
    if (Number.isNaN(numValue) || !Number.isFinite(numValue) || numValue < 0) {
      throw new ApiBadRequestError(
        'el parámetro numérico es inválido, por favor verifique los datos ingresados',
        400,
        null,
        true,
      );
    }
    return numValue;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
