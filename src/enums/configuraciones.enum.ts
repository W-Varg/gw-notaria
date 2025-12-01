/**
 * Enum con las claves de configuración de la aplicación
 */
export enum ConfiguracionClaveEnum {
  // Sistema
  SISTEMA_MANTENIMIENTO = 'sistema_mantenimiento',
  SISTEMA_TEMA_COLOR = 'sistema_tema_color',
  SISTEMA_NOMBRE = 'sistema_nombre',
  SISTEMA_VERSION = 'sistema_version',

  // Políticas
  POLITICA_TERMINOS = 'politica_terminos',
  POLITICA_PRIVACIDAD = 'politica_privacidad',
  POLITICA_DEVOLUCIONES = 'politica_devoluciones',
  POLITICA_ENVIOS = 'politica_envios',

  // Emails
  EMAIL_REMITENTE = 'email_remitente',
  EMAIL_BIENVENIDA_ASUNTO = 'email_bienvenida_asunto',
  EMAIL_BIENVENIDA_CUERPO = 'email_bienvenida_cuerpo',

  // Seguridad
  SEGURIDAD_MAX_INTENTOS_LOGIN = 'seguridad_max_intentos_login',
  SEGURIDAD_BLOQUEO_TIEMPO = 'seguridad_bloqueo_tiempo',

  // Apariencia
  APARIENCIA_LOGO = 'apariencia_logo',
  APARIENCIA_FAVICON = 'apariencia_favicon',

  // Negocio/Contacto
  CONTACTO_EMAIL = 'contacto_email',
  CONTACTO_TELEFONO = 'contacto_telefono',

  // Horarios
  HORARIO_LUNES_VIERNES = 'horario_lunes_viernes',
  HORARIO_SABADO = 'horario_sabado',
  HORARIO_DOMINGO = 'horario_domingo',
}

export enum ConfiguracionTipoEnum {
  TEXTO = 'texto',
  NUMERO = 'numero',
  BOOLEANO = 'booleano',
  JSON = 'json',
  HTML = 'html',
}

export enum ConfiguracionCategoriaEnum {
  SISTEMA = 'sistema',
  NEGOCIO = 'negocio',
  POLITICAS = 'politicas',
  EMAILS = 'emails',
  APARIENCIA = 'apariencia',
  SEGURIDAD = 'seguridad',
}

/**
 * Tipos de tokens temporales
 */
export enum TokenTemporalTipoEnum {
  VERIFICACION_EMAIL = 'verificacion_email',
  RESET_PASSWORD = 'reset_password',
  OTP_LOGIN = 'otp_login',
  TWO_FA_SETUP = '2fa_setup',
}

/**
 * Claves únicas para identificar tokens temporales en la base de datos
 */
export enum TokenTemporalClaveEnum {
  VERIFY_TOKEN = 'verify_token',
  RESET_TOKEN = 'reset_token',
  OTP_EMAIL = 'otp_email',
  TWO_FA_SECRET = '2fa_secret',
}
