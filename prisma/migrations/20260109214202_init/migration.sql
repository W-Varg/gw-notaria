-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "logs";

-- CreateEnum
CREATE TYPE "ConstanciaEnum" AS ENUM ('RECIBO', 'FACTURA');

-- CreateTable
CREATE TABLE "auth_roles" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "estaActivo" BOOLEAN NOT NULL DEFAULT true,
    "userCreateId" TEXT NOT NULL,
    "userUpdateId" TEXT,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaActualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "auth_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth_permisos" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "modulo" TEXT NOT NULL,
    "accion" TEXT NOT NULL,
    "estaActivo" BOOLEAN NOT NULL DEFAULT true,
    "userUpdateId" TEXT,

    CONSTRAINT "auth_permisos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth_rol_permisos" (
    "id" SERIAL NOT NULL,
    "rolId" INTEGER NOT NULL,
    "permisoId" INTEGER NOT NULL,

    CONSTRAINT "auth_rol_permisos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth_usuarios" (
    "id" VARCHAR(26) NOT NULL,
    "email" VARCHAR(150) NOT NULL,
    "password" VARCHAR(150) NOT NULL,
    "nombre" VARCHAR(30) NOT NULL,
    "apellidos" VARCHAR(30) NOT NULL,
    "telefono" VARCHAR(10),
    "direccion" TEXT,
    "avatar" TEXT,
    "sucursalId" INTEGER,
    "estaActivo" BOOLEAN NOT NULL DEFAULT true,
    "emailVerificado" BOOLEAN NOT NULL DEFAULT false,
    "twoFactorSecret" VARCHAR(255),
    "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaActualizacion" TIMESTAMP(3) NOT NULL,
    "userCreateId" TEXT,
    "userUpdateId" TEXT,

    CONSTRAINT "auth_usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth_usuario_roles" (
    "id" SERIAL NOT NULL,
    "usuarioId" VARCHAR(26) NOT NULL,
    "rolId" INTEGER NOT NULL,

    CONSTRAINT "auth_usuario_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth_sesiones" (
    "id" VARCHAR(26) NOT NULL,
    "usuarioId" VARCHAR(26) NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "userAgent" VARCHAR(500),
    "ipAddress" VARCHAR(50),
    "dispositivo" VARCHAR(255),
    "navegador" VARCHAR(100),
    "ubicacion" VARCHAR(255),
    "estaActiva" BOOLEAN NOT NULL DEFAULT true,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaExpiracion" TIMESTAMP(3) NOT NULL,
    "ultimaActividad" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaActualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "auth_sesiones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth_historial_login" (
    "id" VARCHAR(26) NOT NULL,
    "usuarioId" VARCHAR(26) NOT NULL,
    "exitoso" BOOLEAN NOT NULL,
    "ipAddress" VARCHAR(50),
    "userAgent" VARCHAR(500),
    "dispositivo" VARCHAR(255),
    "navegador" VARCHAR(100),
    "ubicacion" VARCHAR(255),
    "motivoFallo" VARCHAR(255),
    "fechaIntento" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "auth_historial_login_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth_dispositivos_confianza" (
    "id" VARCHAR(26) NOT NULL,
    "usuarioId" VARCHAR(26) NOT NULL,
    "deviceFingerprint" VARCHAR(255) NOT NULL,
    "deviceName" VARCHAR(255),
    "userAgent" VARCHAR(500),
    "navegador" VARCHAR(100),
    "sistemaOperativo" VARCHAR(100),
    "estaActivo" BOOLEAN NOT NULL DEFAULT true,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaExpiracion" TIMESTAMP(3) NOT NULL,
    "ultimoUso" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "auth_dispositivos_confianza_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth_tokens_temporales" (
    "id" VARCHAR(26) NOT NULL,
    "clave" TEXT NOT NULL,
    "valor" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "usuarioId" VARCHAR(26) NOT NULL,
    "metadatos" JSONB,
    "fechaExpiracion" TIMESTAMP(3) NOT NULL,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "auth_tokens_temporales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "int_configuracion_aplicacion" (
    "id" VARCHAR(26) NOT NULL,
    "clave" TEXT NOT NULL,
    "valor" TEXT NOT NULL,
    "tipo" TEXT NOT NULL DEFAULT 'texto',
    "categoria" TEXT NOT NULL DEFAULT 'general',
    "descripcion" TEXT,
    "esEditable" BOOLEAN NOT NULL DEFAULT true,
    "userCreateId" TEXT NOT NULL,
    "userUpdateId" TEXT,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaActualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "int_configuracion_aplicacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cat_sucursales" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(150) NOT NULL,
    "abreviacion" VARCHAR(10) NOT NULL,
    "departamento" VARCHAR(100) NOT NULL,
    "direccion" VARCHAR(255) NOT NULL,
    "telefono" VARCHAR(20),
    "email" VARCHAR(100),
    "usuarioResponsableId" VARCHAR(26),
    "estaActiva" BOOLEAN NOT NULL DEFAULT true,
    "userCreateId" TEXT NOT NULL,
    "userUpdateId" TEXT,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaActualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cat_sucursales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cat_contadores_ticket_sucursal" (
    "id" SERIAL NOT NULL,
    "sucursalId" INTEGER NOT NULL,
    "anio" INTEGER NOT NULL,
    "mes" INTEGER NOT NULL,
    "ultimoNumero" INTEGER NOT NULL DEFAULT 0,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaActualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cat_contadores_ticket_sucursal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cat_tipos_tramite" (
    "id" VARCHAR(26) NOT NULL,
    "sucursalId" INTEGER NOT NULL,
    "tipoDocumentoId" VARCHAR(26),
    "nombre" VARCHAR(150) NOT NULL,
    "colorHex" VARCHAR(15) NOT NULL DEFAULT '#1abc9c',
    "icon" VARCHAR(15) NOT NULL DEFAULT 'pi pi-code',
    "descripcion" VARCHAR(500),
    "claseTramite" VARCHAR(50),
    "negocio" VARCHAR(50),
    "imagen" TEXT,
    "costoBase" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "estaActiva" BOOLEAN NOT NULL DEFAULT true,
    "userCreateId" TEXT NOT NULL,
    "userUpdateId" TEXT,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaActualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cat_tipos_tramite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "int_notificaciones" (
    "id" VARCHAR(26) NOT NULL,
    "usuarioId" VARCHAR(26) NOT NULL,
    "titulo" VARCHAR(255) NOT NULL,
    "mensaje" TEXT NOT NULL,
    "tipo" VARCHAR(20) NOT NULL DEFAULT 'info',
    "leida" BOOLEAN NOT NULL DEFAULT false,
    "icono" VARCHAR(50),
    "ruta" VARCHAR(255),
    "userCreateId" TEXT NOT NULL,
    "userUpdateId" TEXT,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaActualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "int_notificaciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "int_mensajes_contacto" (
    "id" VARCHAR(26) NOT NULL,
    "usuarioId" VARCHAR(26),
    "nombre" TEXT NOT NULL,
    "correo" TEXT NOT NULL,
    "telefono" TEXT,
    "asunto" TEXT NOT NULL,
    "mensaje" TEXT NOT NULL,
    "categoria" TEXT NOT NULL DEFAULT 'consulta',
    "estado" TEXT NOT NULL DEFAULT 'no_leido',
    "userCreateId" TEXT,
    "userUpdateId" TEXT,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaActualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "int_mensajes_contacto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cat_bancos" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "userCreateId" TEXT NOT NULL,
    "userUpdateId" TEXT,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaActualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cat_bancos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cont_cuentas_bancarias" (
    "id" SERIAL NOT NULL,
    "bancoId" INTEGER NOT NULL,
    "numeroCuenta" VARCHAR(50) NOT NULL,
    "tipoCuenta" VARCHAR(50),
    "saldoActual" DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    "userCreateId" TEXT NOT NULL,
    "userUpdateId" TEXT,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaActualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cont_cuentas_bancarias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cat_tipos_documento" (
    "id" VARCHAR(26) NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "descripcion" TEXT NOT NULL,
    "precioBase" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "userCreateId" TEXT NOT NULL,
    "userUpdateId" TEXT,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaActualizacion" TIMESTAMP(3) NOT NULL,
    "estaActivo" BOOLEAN DEFAULT true,

    CONSTRAINT "cat_tipos_documento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cat_plantillas_documento" (
    "id" SERIAL NOT NULL,
    "tipoDocumentoId" VARCHAR(26) NOT NULL,
    "nombrePlantilla" VARCHAR(100),
    "descripcion" TEXT,
    "contenidoHtml" TEXT,
    "estaActiva" BOOLEAN DEFAULT true,
    "userCreateId" TEXT NOT NULL,
    "userUpdateId" TEXT,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaActualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cat_plantillas_documento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cat_estados_tramite" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "descripcion" TEXT,
    "colorHex" VARCHAR(7),
    "orden" INTEGER NOT NULL DEFAULT 0,
    "estaActivo" BOOLEAN NOT NULL DEFAULT true,
    "userCreateId" TEXT NOT NULL,
    "userUpdateId" TEXT,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaActualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cat_estados_tramite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cat_clientes" (
    "id" VARCHAR(26) NOT NULL,
    "tipoCliente" INTEGER NOT NULL,
    "direccion" VARCHAR(255),
    "telefono" VARCHAR(20),
    "email" VARCHAR(100),
    "userCreateId" TEXT NOT NULL,
    "userUpdateId" TEXT,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaActualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cat_clientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cat_personas_naturales" (
    "clienteId" VARCHAR(26) NOT NULL,
    "tipoDocumento" VARCHAR(20) NOT NULL,
    "numeroDocumento" VARCHAR(20) NOT NULL,
    "nombres" VARCHAR(100) NOT NULL,
    "apellidos" VARCHAR(100) NOT NULL,
    "fechaNacimiento" DATE,
    "userCreateId" TEXT NOT NULL,
    "userUpdateId" TEXT,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaActualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cat_personas_naturales_pkey" PRIMARY KEY ("clienteId")
);

-- CreateTable
CREATE TABLE "cat_personas_juridicas" (
    "clienteId" VARCHAR(26) NOT NULL,
    "nit" VARCHAR(20),
    "razonSocial" VARCHAR(150) NOT NULL,
    "representanteLegal" VARCHAR(150),
    "userCreateId" TEXT NOT NULL,
    "userUpdateId" TEXT,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaActualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cat_personas_juridicas_pkey" PRIMARY KEY ("clienteId")
);

-- CreateTable
CREATE TABLE "core_comercializadoras" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(150) NOT NULL,
    "tipoComercializadora" INTEGER NOT NULL,
    "metaData" JSONB NOT NULL,
    "sucursalId" INTEGER NOT NULL,
    "clienteId" VARCHAR(26) NOT NULL,
    "consolidado" BOOLEAN DEFAULT false,
    "minuta" TEXT,
    "protocolo" TEXT,
    "fechaEnvio" TIMESTAMP(3),
    "fechaEnvioTestimonio" TIMESTAMP(3),
    "userCreateId" TEXT NOT NULL,
    "userUpdateId" TEXT,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaActualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "core_comercializadoras_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "core_servicios" (
    "id" VARCHAR(26) NOT NULL,
    "codigoTicket" VARCHAR(20) NOT NULL,
    "clienteId" VARCHAR(26) NOT NULL,
    "comercializadoraId" INTEGER,
    "tipoDocumentoId" VARCHAR(26) NOT NULL,
    "tipoTramiteId" VARCHAR(26) NOT NULL,
    "sucursalId" INTEGER NOT NULL,
    "estadoActualId" INTEGER NOT NULL,
    "fechaInicio" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaFinalizacion" TIMESTAMP(3),
    "fechaEstimadaEntrega" TIMESTAMP(3),
    "plazoEntregaDias" INTEGER,
    "prioridad" VARCHAR(20) NOT NULL DEFAULT 'normal',
    "observaciones" TEXT,
    "contenidoFinal" TEXT,
    "montoTotal" DECIMAL(10,2) NOT NULL,
    "saldoPendiente" DECIMAL(10,2) NOT NULL,
    "estaActivo" BOOLEAN NOT NULL DEFAULT true,
    "userCreateId" TEXT NOT NULL,
    "userUpdateId" TEXT,
    "fechaActualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "core_servicios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "core_historial_estados_servicio" (
    "id" SERIAL NOT NULL,
    "usuarioId" VARCHAR(26),
    "servicioId" VARCHAR(26) NOT NULL,
    "estadoId" INTEGER NOT NULL,
    "fechaCambio" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "comentario" VARCHAR(255),

    CONSTRAINT "core_historial_estados_servicio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "core_responsables_servicio" (
    "id" SERIAL NOT NULL,
    "usuarioId" VARCHAR(26) NOT NULL,
    "servicioId" VARCHAR(26) NOT NULL,
    "fechaAsignacion" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaBaja" TIMESTAMP(3),
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "core_responsables_servicio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "core_derivaciones_servicio" (
    "id" SERIAL NOT NULL,
    "servicioId" VARCHAR(26) NOT NULL,
    "usuarioOrigenId" VARCHAR(26),
    "usuarioDestinoId" VARCHAR(26) NOT NULL,
    "fechaDerivacion" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "motivo" TEXT,
    "prioridad" VARCHAR(20) NOT NULL DEFAULT 'normal',
    "comentario" TEXT,
    "aceptada" BOOLEAN NOT NULL DEFAULT false,
    "fechaAceptacion" TIMESTAMP(3),
    "estaActiva" BOOLEAN NOT NULL DEFAULT true,
    "visualizada" BOOLEAN NOT NULL DEFAULT false,
    "fechaVisualizacion" TIMESTAMP(3),
    "motivoCancelacion" TEXT,
    "fechaCancelacion" TIMESTAMP(3),
    "usuarioCancelacionId" VARCHAR(26),

    CONSTRAINT "core_derivaciones_servicio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cont_pagos_ingresos" (
    "id" SERIAL NOT NULL,
    "servicioId" VARCHAR(26),
    "fecha" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "monto" DECIMAL(10,2) NOT NULL,
    "tipoPago" INTEGER NOT NULL,
    "cuentaBancariaId" INTEGER,
    "constanciaTipo" "ConstanciaEnum",
    "numeroConstancia" VARCHAR(50),
    "concepto" VARCHAR(255),
    "usuarioRegistroId" VARCHAR(26),

    CONSTRAINT "cont_pagos_ingresos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cont_gastos" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "descripcion" TEXT,
    "proveedor" VARCHAR(100),
    "montoTotal" DECIMAL(10,2) NOT NULL,
    "montoPagado" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "saldo" DECIMAL(10,2),
    "fechaGasto" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "categoria" VARCHAR(50),
    "usuarioId" VARCHAR(26),
    "userCreateId" TEXT NOT NULL,
    "userUpdateId" TEXT,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaActualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cont_gastos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cont_transacciones_egresos" (
    "id" SERIAL NOT NULL,
    "gastoId" INTEGER NOT NULL,
    "monto" DECIMAL(10,2) NOT NULL,
    "fecha" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cuentaBancariaId" INTEGER,
    "metodoPago" INTEGER NOT NULL,

    CONSTRAINT "cont_transacciones_egresos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cont_arqueos_diarios" (
    "id" SERIAL NOT NULL,
    "fecha" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuarioCierreId" VARCHAR(26),
    "totalIngresosEfectivo" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "totalIngresosBancos" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "totalEgresosEfectivo" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "totalEgresosBancos" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "saldoFinalDia" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "observaciones" TEXT,
    "fechaCierre" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cont_arqueos_diarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "logs"."logs_audit" (
    "id" VARCHAR(26) NOT NULL,
    "accion" INTEGER NOT NULL,
    "modulo" TEXT NOT NULL,
    "tabla" TEXT,
    "registroId" TEXT,
    "descripcion" TEXT NOT NULL,
    "usuarioId" VARCHAR(26),
    "usuarioEmail" TEXT,
    "usuarioNombre" TEXT,
    "usuarioIp" TEXT,
    "userAgent" TEXT,
    "datosAnteriores" JSONB,
    "datosNuevos" JSONB,
    "cambiosRealizados" JSONB,
    "metadatos" JSONB,
    "duracionMs" INTEGER,
    "exitoso" BOOLEAN NOT NULL DEFAULT true,
    "mensajeError" TEXT,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "logs_audit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "logs"."logs_system" (
    "id" VARCHAR(26) NOT NULL,
    "nivel" INTEGER NOT NULL DEFAULT 1,
    "mensaje" TEXT NOT NULL,
    "contexto" TEXT,
    "modulo" TEXT,
    "stackTrace" TEXT,
    "metadatos" JSONB,
    "usuarioId" VARCHAR(26),
    "usuarioEmail" TEXT,
    "metodoHttp" TEXT,
    "url" TEXT,
    "requestBody" JSONB,
    "responseCode" INTEGER,
    "duracionMs" INTEGER,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "logs_system_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "logs"."logs_login_attempts" (
    "id" VARCHAR(26) NOT NULL,
    "email" TEXT NOT NULL,
    "exitoso" BOOLEAN NOT NULL,
    "motivoFallo" TEXT,
    "ip" TEXT NOT NULL,
    "userAgent" TEXT,
    "ubicacion" TEXT,
    "dispositivo" TEXT,
    "navegador" TEXT,
    "intentosSospechoso" BOOLEAN NOT NULL DEFAULT false,
    "bloqueado" BOOLEAN NOT NULL DEFAULT false,
    "fechaIntento" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "logs_login_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "logs"."logs_access" (
    "id" VARCHAR(26) NOT NULL,
    "usuarioId" VARCHAR(26),
    "usuarioEmail" TEXT,
    "recurso" TEXT NOT NULL,
    "metodoHttp" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "endpoint" TEXT,
    "requestBody" JSONB,
    "queryParams" JSONB,
    "responseCode" INTEGER NOT NULL,
    "responseBody" JSONB,
    "duracionMs" INTEGER NOT NULL,
    "ip" TEXT NOT NULL,
    "userAgent" TEXT,
    "fechaAcceso" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "logs_access_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "logs"."logs_data_changes" (
    "id" VARCHAR(26) NOT NULL,
    "tabla" TEXT NOT NULL,
    "registroId" TEXT NOT NULL,
    "campo" TEXT NOT NULL,
    "valorAnterior" TEXT,
    "valorNuevo" TEXT,
    "tipoCambio" TEXT NOT NULL,
    "usuarioId" VARCHAR(26),
    "usuarioEmail" TEXT,
    "usuarioNombre" TEXT,
    "razonCambio" TEXT,
    "ipOrigen" TEXT,
    "fechaCambio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "logs_data_changes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "logs"."logs_errors" (
    "id" VARCHAR(26) NOT NULL,
    "mensaje" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "codigo" TEXT,
    "severidad" TEXT NOT NULL,
    "stackTrace" TEXT NOT NULL,
    "contexto" TEXT,
    "modulo" TEXT,
    "metodoHttp" TEXT,
    "url" TEXT,
    "requestBody" JSONB,
    "usuarioId" VARCHAR(26),
    "usuarioEmail" TEXT,
    "ip" TEXT,
    "resuelto" BOOLEAN NOT NULL DEFAULT false,
    "fechaResolucion" TIMESTAMP(3),
    "notasResolucion" TEXT,
    "fechaError" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "logs_errors_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "auth_roles_nombre_key" ON "auth_roles"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "auth_permisos_nombre_key" ON "auth_permisos"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "auth_rol_permisos_rolId_permisoId_key" ON "auth_rol_permisos"("rolId", "permisoId");

-- CreateIndex
CREATE UNIQUE INDEX "auth_usuarios_email_key" ON "auth_usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "auth_usuario_roles_usuarioId_rolId_key" ON "auth_usuario_roles"("usuarioId", "rolId");

-- CreateIndex
CREATE UNIQUE INDEX "auth_sesiones_refreshToken_key" ON "auth_sesiones"("refreshToken");

-- CreateIndex
CREATE UNIQUE INDEX "auth_dispositivos_confianza_usuarioId_deviceFingerprint_key" ON "auth_dispositivos_confianza"("usuarioId", "deviceFingerprint");

-- CreateIndex
CREATE INDEX "auth_tokens_temporales_usuarioId_idx" ON "auth_tokens_temporales"("usuarioId");

-- CreateIndex
CREATE INDEX "auth_tokens_temporales_fechaExpiracion_idx" ON "auth_tokens_temporales"("fechaExpiracion");

-- CreateIndex
CREATE INDEX "auth_tokens_temporales_tipo_idx" ON "auth_tokens_temporales"("tipo");

-- CreateIndex
CREATE UNIQUE INDEX "auth_tokens_temporales_usuarioId_tipo_key" ON "auth_tokens_temporales"("usuarioId", "tipo");

-- CreateIndex
CREATE UNIQUE INDEX "int_configuracion_aplicacion_clave_key" ON "int_configuracion_aplicacion"("clave");

-- CreateIndex
CREATE INDEX "int_configuracion_aplicacion_categoria_idx" ON "int_configuracion_aplicacion"("categoria");

-- CreateIndex
CREATE UNIQUE INDEX "cat_sucursales_nombre_key" ON "cat_sucursales"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "cat_sucursales_abreviacion_key" ON "cat_sucursales"("abreviacion");

-- CreateIndex
CREATE UNIQUE INDEX "cat_contadores_ticket_sucursal_sucursalId_anio_mes_key" ON "cat_contadores_ticket_sucursal"("sucursalId", "anio", "mes");

-- CreateIndex
CREATE UNIQUE INDEX "cat_tipos_tramite_sucursalId_nombre_key" ON "cat_tipos_tramite"("sucursalId", "nombre");

-- CreateIndex
CREATE INDEX "int_notificaciones_usuarioId_idx" ON "int_notificaciones"("usuarioId");

-- CreateIndex
CREATE INDEX "int_notificaciones_leida_idx" ON "int_notificaciones"("leida");

-- CreateIndex
CREATE INDEX "int_notificaciones_fechaCreacion_idx" ON "int_notificaciones"("fechaCreacion");

-- CreateIndex
CREATE UNIQUE INDEX "cat_tipos_documento_nombre_key" ON "cat_tipos_documento"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "cat_estados_tramite_nombre_key" ON "cat_estados_tramite"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "cat_personas_naturales_numeroDocumento_key" ON "cat_personas_naturales"("numeroDocumento");

-- CreateIndex
CREATE UNIQUE INDEX "cat_personas_juridicas_nit_key" ON "cat_personas_juridicas"("nit");

-- CreateIndex
CREATE UNIQUE INDEX "cat_personas_juridicas_razonSocial_key" ON "cat_personas_juridicas"("razonSocial");

-- CreateIndex
CREATE UNIQUE INDEX "core_comercializadoras_nombre_key" ON "core_comercializadoras"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "core_servicios_codigoTicket_key" ON "core_servicios"("codigoTicket");

-- CreateIndex
CREATE INDEX "core_derivaciones_servicio_servicioId_idx" ON "core_derivaciones_servicio"("servicioId");

-- CreateIndex
CREATE INDEX "core_derivaciones_servicio_usuarioDestinoId_idx" ON "core_derivaciones_servicio"("usuarioDestinoId");

-- CreateIndex
CREATE INDEX "core_derivaciones_servicio_fechaDerivacion_idx" ON "core_derivaciones_servicio"("fechaDerivacion");

-- CreateIndex
CREATE INDEX "core_derivaciones_servicio_estaActiva_idx" ON "core_derivaciones_servicio"("estaActiva");

-- CreateIndex
CREATE INDEX "core_derivaciones_servicio_visualizada_idx" ON "core_derivaciones_servicio"("visualizada");

-- CreateIndex
CREATE UNIQUE INDEX "cont_arqueos_diarios_fecha_key" ON "cont_arqueos_diarios"("fecha");

-- CreateIndex
CREATE INDEX "logs_audit_usuarioId_idx" ON "logs"."logs_audit"("usuarioId");

-- CreateIndex
CREATE INDEX "logs_audit_modulo_idx" ON "logs"."logs_audit"("modulo");

-- CreateIndex
CREATE INDEX "logs_audit_accion_idx" ON "logs"."logs_audit"("accion");

-- CreateIndex
CREATE INDEX "logs_audit_tabla_idx" ON "logs"."logs_audit"("tabla");

-- CreateIndex
CREATE INDEX "logs_audit_registroId_idx" ON "logs"."logs_audit"("registroId");

-- CreateIndex
CREATE INDEX "logs_audit_fechaCreacion_idx" ON "logs"."logs_audit"("fechaCreacion");

-- CreateIndex
CREATE INDEX "logs_system_nivel_idx" ON "logs"."logs_system"("nivel");

-- CreateIndex
CREATE INDEX "logs_system_modulo_idx" ON "logs"."logs_system"("modulo");

-- CreateIndex
CREATE INDEX "logs_system_fechaCreacion_idx" ON "logs"."logs_system"("fechaCreacion");

-- CreateIndex
CREATE INDEX "logs_system_usuarioId_idx" ON "logs"."logs_system"("usuarioId");

-- CreateIndex
CREATE INDEX "logs_login_attempts_email_idx" ON "logs"."logs_login_attempts"("email");

-- CreateIndex
CREATE INDEX "logs_login_attempts_ip_idx" ON "logs"."logs_login_attempts"("ip");

-- CreateIndex
CREATE INDEX "logs_login_attempts_fechaIntento_idx" ON "logs"."logs_login_attempts"("fechaIntento");

-- CreateIndex
CREATE INDEX "logs_login_attempts_exitoso_idx" ON "logs"."logs_login_attempts"("exitoso");

-- CreateIndex
CREATE INDEX "logs_access_usuarioId_idx" ON "logs"."logs_access"("usuarioId");

-- CreateIndex
CREATE INDEX "logs_access_recurso_idx" ON "logs"."logs_access"("recurso");

-- CreateIndex
CREATE INDEX "logs_access_metodoHttp_idx" ON "logs"."logs_access"("metodoHttp");

-- CreateIndex
CREATE INDEX "logs_access_responseCode_idx" ON "logs"."logs_access"("responseCode");

-- CreateIndex
CREATE INDEX "logs_access_fechaAcceso_idx" ON "logs"."logs_access"("fechaAcceso");

-- CreateIndex
CREATE INDEX "logs_data_changes_tabla_idx" ON "logs"."logs_data_changes"("tabla");

-- CreateIndex
CREATE INDEX "logs_data_changes_registroId_idx" ON "logs"."logs_data_changes"("registroId");

-- CreateIndex
CREATE INDEX "logs_data_changes_usuarioId_idx" ON "logs"."logs_data_changes"("usuarioId");

-- CreateIndex
CREATE INDEX "logs_data_changes_fechaCambio_idx" ON "logs"."logs_data_changes"("fechaCambio");

-- CreateIndex
CREATE INDEX "logs_data_changes_campo_idx" ON "logs"."logs_data_changes"("campo");

-- CreateIndex
CREATE INDEX "logs_errors_tipo_idx" ON "logs"."logs_errors"("tipo");

-- CreateIndex
CREATE INDEX "logs_errors_severidad_idx" ON "logs"."logs_errors"("severidad");

-- CreateIndex
CREATE INDEX "logs_errors_resuelto_idx" ON "logs"."logs_errors"("resuelto");

-- CreateIndex
CREATE INDEX "logs_errors_fechaError_idx" ON "logs"."logs_errors"("fechaError");

-- CreateIndex
CREATE INDEX "logs_errors_modulo_idx" ON "logs"."logs_errors"("modulo");

-- AddForeignKey
ALTER TABLE "auth_rol_permisos" ADD CONSTRAINT "auth_rol_permisos_rolId_fkey" FOREIGN KEY ("rolId") REFERENCES "auth_roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth_rol_permisos" ADD CONSTRAINT "auth_rol_permisos_permisoId_fkey" FOREIGN KEY ("permisoId") REFERENCES "auth_permisos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth_usuarios" ADD CONSTRAINT "auth_usuarios_sucursalId_fkey" FOREIGN KEY ("sucursalId") REFERENCES "cat_sucursales"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth_usuario_roles" ADD CONSTRAINT "auth_usuario_roles_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "auth_usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth_usuario_roles" ADD CONSTRAINT "auth_usuario_roles_rolId_fkey" FOREIGN KEY ("rolId") REFERENCES "auth_roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth_sesiones" ADD CONSTRAINT "auth_sesiones_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "auth_usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth_historial_login" ADD CONSTRAINT "auth_historial_login_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "auth_usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth_dispositivos_confianza" ADD CONSTRAINT "auth_dispositivos_confianza_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "auth_usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth_tokens_temporales" ADD CONSTRAINT "auth_tokens_temporales_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "auth_usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cat_contadores_ticket_sucursal" ADD CONSTRAINT "cat_contadores_ticket_sucursal_sucursalId_fkey" FOREIGN KEY ("sucursalId") REFERENCES "cat_sucursales"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cat_tipos_tramite" ADD CONSTRAINT "cat_tipos_tramite_tipoDocumentoId_fkey" FOREIGN KEY ("tipoDocumentoId") REFERENCES "cat_tipos_documento"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cat_tipos_tramite" ADD CONSTRAINT "cat_tipos_tramite_sucursalId_fkey" FOREIGN KEY ("sucursalId") REFERENCES "cat_sucursales"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "int_notificaciones" ADD CONSTRAINT "int_notificaciones_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "auth_usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "int_mensajes_contacto" ADD CONSTRAINT "int_mensajes_contacto_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "auth_usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cont_cuentas_bancarias" ADD CONSTRAINT "cont_cuentas_bancarias_bancoId_fkey" FOREIGN KEY ("bancoId") REFERENCES "cat_bancos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cat_plantillas_documento" ADD CONSTRAINT "cat_plantillas_documento_tipoDocumentoId_fkey" FOREIGN KEY ("tipoDocumentoId") REFERENCES "cat_tipos_documento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cat_personas_naturales" ADD CONSTRAINT "cat_personas_naturales_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "cat_clientes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cat_personas_juridicas" ADD CONSTRAINT "cat_personas_juridicas_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "cat_clientes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core_comercializadoras" ADD CONSTRAINT "core_comercializadoras_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "cat_clientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core_comercializadoras" ADD CONSTRAINT "core_comercializadoras_sucursalId_fkey" FOREIGN KEY ("sucursalId") REFERENCES "cat_sucursales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core_servicios" ADD CONSTRAINT "core_servicios_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "cat_clientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core_servicios" ADD CONSTRAINT "core_servicios_tipoDocumentoId_fkey" FOREIGN KEY ("tipoDocumentoId") REFERENCES "cat_tipos_documento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core_servicios" ADD CONSTRAINT "core_servicios_tipoTramiteId_fkey" FOREIGN KEY ("tipoTramiteId") REFERENCES "cat_tipos_tramite"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core_servicios" ADD CONSTRAINT "core_servicios_sucursalId_fkey" FOREIGN KEY ("sucursalId") REFERENCES "cat_sucursales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core_servicios" ADD CONSTRAINT "core_servicios_estadoActualId_fkey" FOREIGN KEY ("estadoActualId") REFERENCES "cat_estados_tramite"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core_servicios" ADD CONSTRAINT "core_servicios_comercializadoraId_fkey" FOREIGN KEY ("comercializadoraId") REFERENCES "core_comercializadoras"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core_historial_estados_servicio" ADD CONSTRAINT "core_historial_estados_servicio_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "auth_usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core_historial_estados_servicio" ADD CONSTRAINT "core_historial_estados_servicio_servicioId_fkey" FOREIGN KEY ("servicioId") REFERENCES "core_servicios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core_historial_estados_servicio" ADD CONSTRAINT "core_historial_estados_servicio_estadoId_fkey" FOREIGN KEY ("estadoId") REFERENCES "cat_estados_tramite"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core_responsables_servicio" ADD CONSTRAINT "core_responsables_servicio_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "auth_usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core_responsables_servicio" ADD CONSTRAINT "core_responsables_servicio_servicioId_fkey" FOREIGN KEY ("servicioId") REFERENCES "core_servicios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core_derivaciones_servicio" ADD CONSTRAINT "core_derivaciones_servicio_servicioId_fkey" FOREIGN KEY ("servicioId") REFERENCES "core_servicios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core_derivaciones_servicio" ADD CONSTRAINT "core_derivaciones_servicio_usuarioOrigenId_fkey" FOREIGN KEY ("usuarioOrigenId") REFERENCES "auth_usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core_derivaciones_servicio" ADD CONSTRAINT "core_derivaciones_servicio_usuarioDestinoId_fkey" FOREIGN KEY ("usuarioDestinoId") REFERENCES "auth_usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cont_pagos_ingresos" ADD CONSTRAINT "cont_pagos_ingresos_servicioId_fkey" FOREIGN KEY ("servicioId") REFERENCES "core_servicios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cont_pagos_ingresos" ADD CONSTRAINT "cont_pagos_ingresos_cuentaBancariaId_fkey" FOREIGN KEY ("cuentaBancariaId") REFERENCES "cont_cuentas_bancarias"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cont_pagos_ingresos" ADD CONSTRAINT "cont_pagos_ingresos_usuarioRegistroId_fkey" FOREIGN KEY ("usuarioRegistroId") REFERENCES "auth_usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cont_gastos" ADD CONSTRAINT "cont_gastos_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "auth_usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cont_transacciones_egresos" ADD CONSTRAINT "cont_transacciones_egresos_gastoId_fkey" FOREIGN KEY ("gastoId") REFERENCES "cont_gastos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cont_transacciones_egresos" ADD CONSTRAINT "cont_transacciones_egresos_cuentaBancariaId_fkey" FOREIGN KEY ("cuentaBancariaId") REFERENCES "cont_cuentas_bancarias"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cont_arqueos_diarios" ADD CONSTRAINT "cont_arqueos_diarios_usuarioCierreId_fkey" FOREIGN KEY ("usuarioCierreId") REFERENCES "auth_usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logs"."logs_audit" ADD CONSTRAINT "logs_audit_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "auth_usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;
