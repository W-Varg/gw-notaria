-- CreateEnum
CREATE TYPE "TipoAccionEnum" AS ENUM ('CREATE', 'UPDATE', 'DELETE', 'READ', 'LOGIN', 'LOGOUT', 'EXPORT', 'IMPORT', 'PRINT', 'DOWNLOAD', 'APPROVE', 'REJECT', 'ACTIVATE', 'DEACTIVATE', 'RESTORE', 'CUSTOM');

-- CreateEnum
CREATE TYPE "NivelLogEnum" AS ENUM ('INFO', 'WARNING', 'ERROR', 'CRITICAL', 'DEBUG');

-- CreateTable
CREATE TABLE "logs_audit_logs" (
    "id" TEXT NOT NULL,
    "accion" "TipoAccionEnum" NOT NULL,
    "modulo" TEXT NOT NULL,
    "tabla" TEXT,
    "registroId" TEXT,
    "descripcion" TEXT NOT NULL,
    "usuarioId" TEXT,
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

    CONSTRAINT "logs_audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "logs_system_logs" (
    "id" TEXT NOT NULL,
    "nivel" "NivelLogEnum" NOT NULL DEFAULT 'INFO',
    "mensaje" TEXT NOT NULL,
    "contexto" TEXT,
    "modulo" TEXT,
    "stackTrace" TEXT,
    "metadatos" JSONB,
    "usuarioId" TEXT,
    "usuarioEmail" TEXT,
    "metodoHttp" TEXT,
    "url" TEXT,
    "requestBody" JSONB,
    "responseCode" INTEGER,
    "duracionMs" INTEGER,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "logs_system_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "logs_login_attempts" (
    "id" TEXT NOT NULL,
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
CREATE TABLE "logs_access_logs" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT,
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

    CONSTRAINT "logs_access_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "logs_data_change_logs" (
    "id" TEXT NOT NULL,
    "tabla" TEXT NOT NULL,
    "registroId" TEXT NOT NULL,
    "campo" TEXT NOT NULL,
    "valorAnterior" TEXT,
    "valorNuevo" TEXT,
    "tipoCambio" TEXT NOT NULL,
    "usuarioId" TEXT,
    "usuarioEmail" TEXT,
    "usuarioNombre" TEXT,
    "razonCambio" TEXT,
    "ipOrigen" TEXT,
    "fechaCambio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "logs_data_change_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "logs_error_logs" (
    "id" TEXT NOT NULL,
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
    "usuarioId" TEXT,
    "usuarioEmail" TEXT,
    "ip" TEXT,
    "resuelto" BOOLEAN NOT NULL DEFAULT false,
    "fechaResolucion" TIMESTAMP(3),
    "notasResolucion" TEXT,
    "fechaError" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "logs_error_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "logs_audit_logs_usuarioId_idx" ON "logs_audit_logs"("usuarioId");

-- CreateIndex
CREATE INDEX "logs_audit_logs_modulo_idx" ON "logs_audit_logs"("modulo");

-- CreateIndex
CREATE INDEX "logs_audit_logs_accion_idx" ON "logs_audit_logs"("accion");

-- CreateIndex
CREATE INDEX "logs_audit_logs_tabla_idx" ON "logs_audit_logs"("tabla");

-- CreateIndex
CREATE INDEX "logs_audit_logs_registroId_idx" ON "logs_audit_logs"("registroId");

-- CreateIndex
CREATE INDEX "logs_audit_logs_fechaCreacion_idx" ON "logs_audit_logs"("fechaCreacion");

-- CreateIndex
CREATE INDEX "logs_system_logs_nivel_idx" ON "logs_system_logs"("nivel");

-- CreateIndex
CREATE INDEX "logs_system_logs_modulo_idx" ON "logs_system_logs"("modulo");

-- CreateIndex
CREATE INDEX "logs_system_logs_fechaCreacion_idx" ON "logs_system_logs"("fechaCreacion");

-- CreateIndex
CREATE INDEX "logs_system_logs_usuarioId_idx" ON "logs_system_logs"("usuarioId");

-- CreateIndex
CREATE INDEX "logs_login_attempts_email_idx" ON "logs_login_attempts"("email");

-- CreateIndex
CREATE INDEX "logs_login_attempts_ip_idx" ON "logs_login_attempts"("ip");

-- CreateIndex
CREATE INDEX "logs_login_attempts_fechaIntento_idx" ON "logs_login_attempts"("fechaIntento");

-- CreateIndex
CREATE INDEX "logs_login_attempts_exitoso_idx" ON "logs_login_attempts"("exitoso");

-- CreateIndex
CREATE INDEX "logs_access_logs_usuarioId_idx" ON "logs_access_logs"("usuarioId");

-- CreateIndex
CREATE INDEX "logs_access_logs_recurso_idx" ON "logs_access_logs"("recurso");

-- CreateIndex
CREATE INDEX "logs_access_logs_metodoHttp_idx" ON "logs_access_logs"("metodoHttp");

-- CreateIndex
CREATE INDEX "logs_access_logs_responseCode_idx" ON "logs_access_logs"("responseCode");

-- CreateIndex
CREATE INDEX "logs_access_logs_fechaAcceso_idx" ON "logs_access_logs"("fechaAcceso");

-- CreateIndex
CREATE INDEX "logs_data_change_logs_tabla_idx" ON "logs_data_change_logs"("tabla");

-- CreateIndex
CREATE INDEX "logs_data_change_logs_registroId_idx" ON "logs_data_change_logs"("registroId");

-- CreateIndex
CREATE INDEX "logs_data_change_logs_usuarioId_idx" ON "logs_data_change_logs"("usuarioId");

-- CreateIndex
CREATE INDEX "logs_data_change_logs_fechaCambio_idx" ON "logs_data_change_logs"("fechaCambio");

-- CreateIndex
CREATE INDEX "logs_data_change_logs_campo_idx" ON "logs_data_change_logs"("campo");

-- CreateIndex
CREATE INDEX "logs_error_logs_tipo_idx" ON "logs_error_logs"("tipo");

-- CreateIndex
CREATE INDEX "logs_error_logs_severidad_idx" ON "logs_error_logs"("severidad");

-- CreateIndex
CREATE INDEX "logs_error_logs_resuelto_idx" ON "logs_error_logs"("resuelto");

-- CreateIndex
CREATE INDEX "logs_error_logs_fechaError_idx" ON "logs_error_logs"("fechaError");

-- CreateIndex
CREATE INDEX "logs_error_logs_modulo_idx" ON "logs_error_logs"("modulo");

-- AddForeignKey
ALTER TABLE "logs_audit_logs" ADD CONSTRAINT "logs_audit_logs_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "auth_usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;
