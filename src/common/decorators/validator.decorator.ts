/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import {
  isDate,
  isEmail,
  isInt,
  isNumber,
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { DateTime } from 'luxon';

@ValidatorConstraint({ name: 'isDateFormatValid', async: false })
export class IsDateFormatValid implements ValidatorConstraintInterface {
  validate(text: string, validationArguments: ValidationArguments) {
    const [regex, field] = validationArguments.constraints;
    const regExp = new RegExp(regex);
    return regExp.test(text);
  }

  defaultMessage(args: ValidationArguments) {
    return 'date format error, only allowed (ej. 01/01/2022)';
  }
}

@ValidatorConstraint({ name: 'error' }) //this validator recieves min max and regular expression
export class CustomWordsValidator implements ValidatorConstraintInterface {
  validate(text: string, validationArguments: ValidationArguments) {
    const [min, max, regex] = validationArguments.constraints;
    const regExp = new RegExp(regex);
    return text?.length >= min && text?.length <= max && regExp.test(text);
  }
}

@ValidatorConstraint({ name: 'error' })
export class CustomIntStringValidator implements ValidatorConstraintInterface {
  validate(text: string) {
    const value = Number.parseInt(text, 10);
    if (value) return true;
    return false;
  }
}

@ValidatorConstraint({ name: 'error' })
export class CustomJustExpressionValidator implements ValidatorConstraintInterface {
  validate(text: string, validationArguments: ValidationArguments) {
    const [regex] = validationArguments.constraints;
    const regExp = new RegExp(regex);
    return regExp.test(text);
  }
}

@ValidatorConstraint({ name: 'error' })
export class CustomIdsValidator implements ValidatorConstraintInterface {
  validate(ids: number[]) {
    if (ids.length === 0) return false;
    let valid = true;
    for (const id of ids) {
      if (id < 1) valid = false;
    }
    return valid;
  }
}

@ValidatorConstraint({ name: 'error' })
export class CustomCharacterValidator implements ValidatorConstraintInterface {
  validate(text: string, validationArguments: ValidationArguments) {
    return text.length === 1 && validationArguments.constraints.includes(text);
  }
}

// ===

@ValidatorConstraint({ name: 'error' })
export class CustomWordsForNameValidator implements ValidatorConstraintInterface {
  validate(name: string, validationArguments: ValidationArguments) {
    const [min, max, re] = validationArguments.constraints;
    const regExp = new RegExp(re);
    const spName = name.split(' ');
    let valido = true;
    for (const st of spName) {
      let counter = 0;
      if (st.startsWith("'") || st.endsWith("'")) valido = false;
      for (let index = 0; index < st.length; index++) {
        if (st.charAt(index) === "'") {
          counter++;
        }
      }
      if (counter > 1) valido = false;
    }
    return valido && name.length >= min && name.length <= max && regExp.test(name);
  }
}

@ValidatorConstraint({ name: 'error' })
export class CustomEmailValidator implements ValidatorConstraintInterface {
  validate(text: string, validationArguments: ValidationArguments) {
    const [min, max] = validationArguments.constraints;
    return text.length >= min && text.length <= max && isEmail(text);
  }
}

@ValidatorConstraint({ name: 'error' })
export class CustomDateValidator implements ValidatorConstraintInterface {
  validate(date: Date, validationArguments: ValidationArguments) {
    const new_date = new Date(date);
    return isDate(new_date);
  }
}

@ValidatorConstraint({ name: 'error' })
export class CustomDatesValidator implements ValidatorConstraintInterface {
  validate(dates: any, validationArguments: ValidationArguments) {
    const { fecha_ini, fecha_fin } = dates;
    const ini = new Date(fecha_ini);
    const fin = new Date(fecha_fin);
    if (isDate(ini) && isDate(fin) && ini < fin) return true;
    return false;
  }
}

@ValidatorConstraint({ name: 'error' })
export class CustomArrayMinValidator implements ValidatorConstraintInterface {
  async validate(array: any, validationArguments: ValidationArguments) {
    const [min] = validationArguments.constraints;
    return array.length >= min;
  }
}
interface grades {
  idestudiante: number;
  nota1: number;
  nota2: number;
  nota3: number;
}

@ValidatorConstraint({ name: 'error' })
export class CustomArrayGradesValidator implements ValidatorConstraintInterface {
  async validate(grades: grades[], validationArguments: ValidationArguments) {
    let valido = true;
    const [min, max] = validationArguments.constraints;
    if (grades.length === 0) valido = false;
    for (const notas of grades) {
      const { nota1, nota2, nota3 } = notas;
      if (nota1 < min || nota1 > max) valido = false;
      if (nota2 < min || nota2 > max) valido = false;
      if (nota3 < min || nota3 > max) valido = false;
    }
    return valido;
  }
}

@ValidatorConstraint({ name: 'error' })
export class CustomValueValidator implements ValidatorConstraintInterface {
  validate(value: number, validationArguments: ValidationArguments) {
    const [min, max] = validationArguments.constraints;
    return value >= min && value <= max && isInt(value);
  }
}

@ValidatorConstraint({ name: 'error' })
export class CustomMinMaxValueValidator implements ValidatorConstraintInterface {
  validate(value: number, validationArguments: ValidationArguments) {
    const [min, max] = validationArguments.constraints;
    return value >= min && value <= max && isNumber(value);
  }
}

@ValidatorConstraint({ name: 'error' })
export class CustomFloatValueValidator implements ValidatorConstraintInterface {
  validate(value: number, validationArguments: ValidationArguments) {
    const [min, max] = validationArguments.constraints;
    return value >= min && value <= max;
  }
}

/* ---------------------------------------------------------------------------------------------- */
/*                                                                                                */
/* ---------------------------------------------------------------------------------------------- */
/**
 * validor de dominio de correo
 */
@ValidatorConstraint({ name: 'IsEmailNotDomain', async: true })
@Injectable()
class EmailDomainValidator implements ValidatorConstraintInterface {
  message: string = null;

  validate(email: string) {
    if (!email) return true; // Permitir valores nulos o indefinidos (opcional)

    const stringEmailsEnv = process.env.EMAIL_NOT_ALLOWED ?? '';
    const emailsList = stringEmailsEnv
      ? stringEmailsEnv
          .split('|')
          .map((domain) => domain.trim())
          .filter((el) => el.length)
      : []; // Reemplaza con array tu lista de dominios no permitidos

    const [emailValue, domain] = email.split('@');

    return domain && emailsList.includes(domain ?? emailValue) ? false : true;
  }

  errorWithSms(sms: string): boolean {
    this.message = sms;
    return false;
  }

  defaultMessage(args: ValidationArguments) {
    const res = this.message
      ? this.message
      : `El correo ${args.value}, no es esta permitido registrar en el Ministerio Público`;
    this.message = null;
    return res;
  }
}

// ===REGISTER VALIDATOR===
export function IsEmailNotDomain(validationOptions?: ValidationOptions): PropertyDecorator {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsEmailNotDomain',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: EmailDomainValidator,
    });
  };
}

/**
 * decorador
 */

@ValidatorConstraint({ name: 'isGreaterThan', async: false })
export class IsGreaterThanConstraint implements ValidatorConstraintInterface {
  private sms = '';
  validate(value: any, args: ValidationArguments) {
    const [field] = args.constraints;

    const startDate = DateTime.fromISO(args.object[field]).setZone('utc').set({ second: 0 });
    const endDate = DateTime.fromISO(value).setZone('utc').set({ second: 0 });

    const firstField =
      args.constraints[1] && args.constraints[1].length ? args.constraints[1] : null;
    const secondField =
      args.constraints[2] && args.constraints[2].length ? args.constraints[2] : null;

    if (endDate < startDate) {
      this.sms = `La ${secondField ?? args.property} debe ser mayor o igual que la ${firstField ?? field}`;
      return false;
    }
    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return this.sms ?? args.constraints[0];
  }
}

/* ---------------------------------------------------------------------------------------------- */
/*                                validador de fecha actual menos 1 minutos                       */
/* ---------------------------------------------------------------------------------------------- */

export function IsDateGreaterThanNow(minutesToSubtract = 1, validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'isDateGreaterThanNow',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const date = DateTime.fromISO(value);
          const now = DateTime.now().minus({ minutes: minutesToSubtract });

          return date.isValid && date > now;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} debe ser mayor o igual a la fecha actual`;
        },
      },
    });
  };
}

// validatos para sql injection
interface SqlInjectionOptions extends ValidationOptions {
  exceptWords?: string[];
  regex?: RegExp;
}

// Decorador personalizado para prevenir inyección SQL
export function IsSQLInjectionSafe(options?: SqlInjectionOptions): PropertyDecorator {
  return function (object: Object, propertyName: string) {
    const exceptWords = options?.exceptWords || [];
    const customRegex = options?.regex;
    const validationOptions = options || {};

    registerDecorator({
      name: 'isSQLInjectionSafe',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [exceptWords, customRegex],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'string') return true;

          const [wordsToExcept = [], regex] = args.constraints;

          // Si se proporciona un regex personalizado, usarlo en lugar de las validaciones SQL
          if (regex instanceof RegExp) {
            return regex.test(value);
          }

          // Validación SQL por defecto con palabras excluidas
          // Crear Set de palabras permitidas (más eficiente para búsqueda)
          const allowedWords = new Set(wordsToExcept.map((word: string) => word.toUpperCase()));

          // Comandos SQL base (sin las palabras excluidas)
          const sqlCommands = [
            'SELECT',
            'INSERT',
            'UPDATE',
            'DELETE',
            'DROP',
            'UNION',
            'EXEC',
            'ALTER',
            'CREATE',
            'TRUNCATE',
          ].filter((cmd) => !allowedWords.has(cmd));

          const sqlClauses = ['WHERE', 'FROM', 'INTO', 'VALUES', 'SET'].filter(
            (clause) => !allowedWords.has(clause),
          );

          const sqlDelayCommands = ['WAITFOR', 'DELAY'].filter((cmd) => !allowedWords.has(cmd));

          // Construir patrones dinámicamente solo con palabras no excluidas
          const patterns = [];

          // Solo agregar patrón de comandos SQL si hay comandos que validar
          if (sqlCommands.length > 0) {
            patterns.push(new RegExp(`\\b(${sqlCommands.join('|')})\\b`, 'i'));
          }

          // Solo agregar patrón de cláusulas SQL si hay cláusulas que validar
          if (sqlClauses.length > 0) {
            patterns.push(new RegExp(`\\b(${sqlClauses.join('|')})\\b`, 'i'));
          }

          // Solo agregar patrón de comandos de delay si hay comandos que validar
          if (sqlDelayCommands.length > 0) {
            patterns.push(new RegExp(`\\b(${sqlDelayCommands.join('|')})\\b`, 'i'));
          }

          // Patrones que siempre se validan (no se pueden excluir por seguridad)
          const alwaysValidatePatterns = [
            /(\b(OR|AND)\s+['"]?\d+['"]?\s*[=<>])/i, // Condiciones lógicas sospechosas
            /(--|\/\*|\*\/|;)/, // Comentarios SQL
            /(\b(XP_|SP_|FN_)\w*\b)/i, // Procedimientos/funciones del sistema
            /['"`\\]/, // Caracteres de escape
          ];

          // Combinar todos los patrones
          const allPatterns = [...patterns, ...alwaysValidatePatterns];

          return !allPatterns.some((pattern) => pattern.test(value));
        },
        defaultMessage(args: ValidationArguments) {
          const [, regex] = args.constraints;
          if (regex instanceof RegExp) {
            return 'El valor no cumple con el formato esperado';
          }
          return 'El valor ingresado contiene caracteres no válidos';
        },
      },
    });
  };
}
