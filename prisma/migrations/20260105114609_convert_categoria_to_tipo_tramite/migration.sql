/*
  Warnings:

  - The primary key for the `clientes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `estados_tramite` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `colorHex` on the `estados_tramite` table. The data in that column could be lost. The data in that column will be cast from `VarChar(10)` to `VarChar(7)`.
  - The primary key for the `personas_juridicas` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `personas_naturales` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `servicios` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `claseTramite` on the `servicios` table. All the data in the column will be lost.
  - You are about to drop the column `negocio` on the `servicios` table. All the data in the column will be lost.
  - You are about to drop the column `tipoTramite` on the `servicios` table. All the data in the column will be lost.
  - The primary key for the `tipos_documento` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `cat_categorias` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `logs_access_logs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `logs_audit_logs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `logs_data_change_logs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `logs_error_logs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `logs_login_attempts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `logs_system_logs` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[nombre]` on the table `estados_tramite` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nombre]` on the table `tipos_documento` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userCreateId` to the `_configuracion_aplicacion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userCreateId` to the `auth_roles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fechaActualizacion` to the `bancos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userCreateId` to the `bancos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fechaActualizacion` to the `clientes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userCreateId` to the `clientes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fechaActualizacion` to the `cuentas_bancarias` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userCreateId` to the `cuentas_bancarias` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fechaActualizacion` to the `estados_tramite` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userCreateId` to the `estados_tramite` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fechaActualizacion` to the `gastos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userCreateId` to the `gastos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userCreateId` to the `notificaciones` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fechaActualizacion` to the `personas_juridicas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userCreateId` to the `personas_juridicas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fechaActualizacion` to the `personas_naturales` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userCreateId` to the `personas_naturales` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fechaActualizacion` to the `plantillas_documento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userCreateId` to the `plantillas_documento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fechaActualizacion` to the `servicios` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipoTramiteId` to the `servicios` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userCreateId` to the `servicios` table without a default value. This is not possible if the table is not empty.
  - Added the required column `descripcion` to the `tipos_documento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fechaActualizacion` to the `tipos_documento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userCreateId` to the `tipos_documento` table without a default value. This is not possible if the table is not empty.

*/
-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "logs";

-- CreateEnum
CREATE TYPE "logs"."TipoAccionEnum" AS ENUM ('CREATE', 'UPDATE', 'DELETE', 'READ', 'LOGIN', 'LOGOUT', 'EXPORT', 'IMPORT', 'PRINT', 'DOWNLOAD', 'APPROVE', 'REJECT', 'ACTIVATE', 'DEACTIVATE', 'RESTORE', 'CUSTOM', 'PASSWORD_CHANGE');

-- CreateEnum
CREATE TYPE "logs"."NivelLogEnum" AS ENUM ('INFO', 'WARNING', 'ERROR', 'CRITICAL', 'DEBUG');

-- DropForeignKey
ALTER TABLE "historial_estados_servicio" DROP CONSTRAINT "historial_estados_servicio_estadoId_fkey";

-- DropForeignKey
ALTER TABLE "historial_estados_servicio" DROP CONSTRAINT "historial_estados_servicio_servicioId_fkey";

-- DropForeignKey
ALTER TABLE "logs_audit_logs" DROP CONSTRAINT "logs_audit_logs_usuarioId_fkey";

-- DropForeignKey
ALTER TABLE "pagos_ingresos" DROP CONSTRAINT "pagos_ingresos_servicioId_fkey";

-- DropForeignKey
ALTER TABLE "personas_juridicas" DROP CONSTRAINT "personas_juridicas_clienteId_fkey";

-- DropForeignKey
ALTER TABLE "personas_naturales" DROP CONSTRAINT "personas_naturales_clienteId_fkey";

-- DropForeignKey
ALTER TABLE "plantillas_documento" DROP CONSTRAINT "plantillas_documento_tipoDocumentoId_fkey";

-- DropForeignKey
ALTER TABLE "responsables_servicio" DROP CONSTRAINT "responsables_servicio_servicioId_fkey";

-- DropForeignKey
ALTER TABLE "servicios" DROP CONSTRAINT "servicios_clienteId_fkey";

-- DropForeignKey
ALTER TABLE "servicios" DROP CONSTRAINT "servicios_tipoDocumentoId_fkey";

-- AlterTable
ALTER TABLE "_configuracion_aplicacion" ADD COLUMN     "userCreateId" TEXT NOT NULL,
ADD COLUMN     "userUpdateId" TEXT;

-- AlterTable
ALTER TABLE "auth_permisos" ADD COLUMN     "userUpdateId" TEXT;

-- AlterTable
ALTER TABLE "auth_roles" ADD COLUMN     "userCreateId" TEXT NOT NULL,
ADD COLUMN     "userUpdateId" TEXT;

-- AlterTable
ALTER TABLE "auth_usuarios" ADD COLUMN     "userCreateId" TEXT,
ADD COLUMN     "userUpdateId" TEXT;

-- AlterTable
ALTER TABLE "bancos" ADD COLUMN     "fechaActualizacion" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "userCreateId" TEXT NOT NULL,
ADD COLUMN     "userUpdateId" TEXT;

-- AlterTable
ALTER TABLE "clientes" DROP CONSTRAINT "clientes_pkey",
ADD COLUMN     "fechaActualizacion" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "userCreateId" TEXT NOT NULL,
ADD COLUMN     "userUpdateId" TEXT,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "clientes_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "clientes_id_seq";

-- AlterTable
ALTER TABLE "cuentas_bancarias" ADD COLUMN     "fechaActualizacion" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "userCreateId" TEXT NOT NULL,
ADD COLUMN     "userUpdateId" TEXT;

-- AlterTable
ALTER TABLE "estados_tramite" DROP CONSTRAINT "estados_tramite_pkey",
ADD COLUMN     "descripcion" TEXT,
ADD COLUMN     "estaActivo" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "fechaActualizacion" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "orden" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "userCreateId" TEXT NOT NULL,
ADD COLUMN     "userUpdateId" TEXT,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "nombre" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "colorHex" SET DATA TYPE VARCHAR(7),
ADD CONSTRAINT "estados_tramite_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "estados_tramite_id_seq";

-- AlterTable
ALTER TABLE "gastos" ADD COLUMN     "fechaActualizacion" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "userCreateId" TEXT NOT NULL,
ADD COLUMN     "userUpdateId" TEXT;

-- AlterTable
ALTER TABLE "historial_estados_servicio" ALTER COLUMN "servicioId" SET DATA TYPE TEXT,
ALTER COLUMN "estadoId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "int_mensajes_contacto" ADD COLUMN     "userCreateId" TEXT,
ADD COLUMN     "userUpdateId" TEXT;

-- AlterTable
ALTER TABLE "notificaciones" ADD COLUMN     "userCreateId" TEXT NOT NULL,
ADD COLUMN     "userUpdateId" TEXT;

-- AlterTable
ALTER TABLE "pagos_ingresos" ALTER COLUMN "servicioId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "personas_juridicas" DROP CONSTRAINT "personas_juridicas_pkey",
ADD COLUMN     "fechaActualizacion" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "userCreateId" TEXT NOT NULL,
ADD COLUMN     "userUpdateId" TEXT,
ALTER COLUMN "clienteId" SET DATA TYPE TEXT,
ADD CONSTRAINT "personas_juridicas_pkey" PRIMARY KEY ("clienteId");

-- AlterTable
ALTER TABLE "personas_naturales" DROP CONSTRAINT "personas_naturales_pkey",
ADD COLUMN     "fechaActualizacion" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "userCreateId" TEXT NOT NULL,
ADD COLUMN     "userUpdateId" TEXT,
ALTER COLUMN "clienteId" SET DATA TYPE TEXT,
ADD CONSTRAINT "personas_naturales_pkey" PRIMARY KEY ("clienteId");

-- AlterTable
ALTER TABLE "plantillas_documento" ADD COLUMN     "descripcion" TEXT,
ADD COLUMN     "estaActiva" BOOLEAN DEFAULT true,
ADD COLUMN     "fechaActualizacion" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "userCreateId" TEXT NOT NULL,
ADD COLUMN     "userUpdateId" TEXT,
ALTER COLUMN "tipoDocumentoId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "responsables_servicio" ALTER COLUMN "servicioId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "servicios" DROP CONSTRAINT "servicios_pkey",
DROP COLUMN "claseTramite",
DROP COLUMN "negocio",
DROP COLUMN "tipoTramite",
ADD COLUMN     "fechaActualizacion" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "tipoTramiteId" TEXT NOT NULL,
ADD COLUMN     "userCreateId" TEXT NOT NULL,
ADD COLUMN     "userUpdateId" TEXT,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "clienteId" SET DATA TYPE TEXT,
ALTER COLUMN "tipoDocumentoId" SET DATA TYPE TEXT,
ADD CONSTRAINT "servicios_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "servicios_id_seq";

-- AlterTable
ALTER TABLE "tipos_documento" DROP CONSTRAINT "tipos_documento_pkey",
ADD COLUMN     "descripcion" TEXT NOT NULL,
ADD COLUMN     "estaActivo" BOOLEAN DEFAULT true,
ADD COLUMN     "fechaActualizacion" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "userCreateId" TEXT NOT NULL,
ADD COLUMN     "userUpdateId" TEXT,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "tipos_documento_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "tipos_documento_id_seq";

-- DropTable
DROP TABLE "cat_categorias";

-- DropTable
DROP TABLE "logs_access_logs";

-- DropTable
DROP TABLE "logs_audit_logs";

-- DropTable
DROP TABLE "logs_data_change_logs";

-- DropTable
DROP TABLE "logs_error_logs";

-- DropTable
DROP TABLE "logs_login_attempts";

-- DropTable
DROP TABLE "logs_system_logs";

-- DropEnum
DROP TYPE "NivelLogEnum";

-- DropEnum
DROP TYPE "TipoAccionEnum";

-- CreateTable
CREATE TABLE "cat_tipos_tramite" (
    "id" TEXT NOT NULL,
    "tipoDocumentoId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "claseTramite" VARCHAR(50),
    "negocio" VARCHAR(50),
    "imagen" TEXT,
    "estaActiva" BOOLEAN NOT NULL DEFAULT true,
    "userCreateId" TEXT NOT NULL,
    "userUpdateId" TEXT,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaActualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cat_tipos_tramite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "logs"."logs_audit_logs" (
    "id" TEXT NOT NULL,
    "accion" "logs"."TipoAccionEnum" NOT NULL,
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
CREATE TABLE "logs"."logs_system_logs" (
    "id" TEXT NOT NULL,
    "nivel" "logs"."NivelLogEnum" NOT NULL DEFAULT 'INFO',
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
CREATE TABLE "logs"."logs_login_attempts" (
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
CREATE TABLE "logs"."logs_access_logs" (
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
CREATE TABLE "logs"."logs_data_change_logs" (
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
CREATE TABLE "logs"."logs_error_logs" (
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
CREATE UNIQUE INDEX "cat_tipos_tramite_nombre_key" ON "cat_tipos_tramite"("nombre");

-- CreateIndex
CREATE INDEX "logs_audit_logs_usuarioId_idx" ON "logs"."logs_audit_logs"("usuarioId");

-- CreateIndex
CREATE INDEX "logs_audit_logs_modulo_idx" ON "logs"."logs_audit_logs"("modulo");

-- CreateIndex
CREATE INDEX "logs_audit_logs_accion_idx" ON "logs"."logs_audit_logs"("accion");

-- CreateIndex
CREATE INDEX "logs_audit_logs_tabla_idx" ON "logs"."logs_audit_logs"("tabla");

-- CreateIndex
CREATE INDEX "logs_audit_logs_registroId_idx" ON "logs"."logs_audit_logs"("registroId");

-- CreateIndex
CREATE INDEX "logs_audit_logs_fechaCreacion_idx" ON "logs"."logs_audit_logs"("fechaCreacion");

-- CreateIndex
CREATE INDEX "logs_system_logs_nivel_idx" ON "logs"."logs_system_logs"("nivel");

-- CreateIndex
CREATE INDEX "logs_system_logs_modulo_idx" ON "logs"."logs_system_logs"("modulo");

-- CreateIndex
CREATE INDEX "logs_system_logs_fechaCreacion_idx" ON "logs"."logs_system_logs"("fechaCreacion");

-- CreateIndex
CREATE INDEX "logs_system_logs_usuarioId_idx" ON "logs"."logs_system_logs"("usuarioId");

-- CreateIndex
CREATE INDEX "logs_login_attempts_email_idx" ON "logs"."logs_login_attempts"("email");

-- CreateIndex
CREATE INDEX "logs_login_attempts_ip_idx" ON "logs"."logs_login_attempts"("ip");

-- CreateIndex
CREATE INDEX "logs_login_attempts_fechaIntento_idx" ON "logs"."logs_login_attempts"("fechaIntento");

-- CreateIndex
CREATE INDEX "logs_login_attempts_exitoso_idx" ON "logs"."logs_login_attempts"("exitoso");

-- CreateIndex
CREATE INDEX "logs_access_logs_usuarioId_idx" ON "logs"."logs_access_logs"("usuarioId");

-- CreateIndex
CREATE INDEX "logs_access_logs_recurso_idx" ON "logs"."logs_access_logs"("recurso");

-- CreateIndex
CREATE INDEX "logs_access_logs_metodoHttp_idx" ON "logs"."logs_access_logs"("metodoHttp");

-- CreateIndex
CREATE INDEX "logs_access_logs_responseCode_idx" ON "logs"."logs_access_logs"("responseCode");

-- CreateIndex
CREATE INDEX "logs_access_logs_fechaAcceso_idx" ON "logs"."logs_access_logs"("fechaAcceso");

-- CreateIndex
CREATE INDEX "logs_data_change_logs_tabla_idx" ON "logs"."logs_data_change_logs"("tabla");

-- CreateIndex
CREATE INDEX "logs_data_change_logs_registroId_idx" ON "logs"."logs_data_change_logs"("registroId");

-- CreateIndex
CREATE INDEX "logs_data_change_logs_usuarioId_idx" ON "logs"."logs_data_change_logs"("usuarioId");

-- CreateIndex
CREATE INDEX "logs_data_change_logs_fechaCambio_idx" ON "logs"."logs_data_change_logs"("fechaCambio");

-- CreateIndex
CREATE INDEX "logs_data_change_logs_campo_idx" ON "logs"."logs_data_change_logs"("campo");

-- CreateIndex
CREATE INDEX "logs_error_logs_tipo_idx" ON "logs"."logs_error_logs"("tipo");

-- CreateIndex
CREATE INDEX "logs_error_logs_severidad_idx" ON "logs"."logs_error_logs"("severidad");

-- CreateIndex
CREATE INDEX "logs_error_logs_resuelto_idx" ON "logs"."logs_error_logs"("resuelto");

-- CreateIndex
CREATE INDEX "logs_error_logs_fechaError_idx" ON "logs"."logs_error_logs"("fechaError");

-- CreateIndex
CREATE INDEX "logs_error_logs_modulo_idx" ON "logs"."logs_error_logs"("modulo");

-- CreateIndex
CREATE UNIQUE INDEX "estados_tramite_nombre_key" ON "estados_tramite"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "tipos_documento_nombre_key" ON "tipos_documento"("nombre");

-- AddForeignKey
ALTER TABLE "cat_tipos_tramite" ADD CONSTRAINT "cat_tipos_tramite_tipoDocumentoId_fkey" FOREIGN KEY ("tipoDocumentoId") REFERENCES "tipos_documento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plantillas_documento" ADD CONSTRAINT "plantillas_documento_tipoDocumentoId_fkey" FOREIGN KEY ("tipoDocumentoId") REFERENCES "tipos_documento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "personas_naturales" ADD CONSTRAINT "personas_naturales_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "clientes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "personas_juridicas" ADD CONSTRAINT "personas_juridicas_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "clientes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "servicios" ADD CONSTRAINT "servicios_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "clientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "servicios" ADD CONSTRAINT "servicios_tipoDocumentoId_fkey" FOREIGN KEY ("tipoDocumentoId") REFERENCES "tipos_documento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "servicios" ADD CONSTRAINT "servicios_tipoTramiteId_fkey" FOREIGN KEY ("tipoTramiteId") REFERENCES "cat_tipos_tramite"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historial_estados_servicio" ADD CONSTRAINT "historial_estados_servicio_servicioId_fkey" FOREIGN KEY ("servicioId") REFERENCES "servicios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historial_estados_servicio" ADD CONSTRAINT "historial_estados_servicio_estadoId_fkey" FOREIGN KEY ("estadoId") REFERENCES "estados_tramite"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "responsables_servicio" ADD CONSTRAINT "responsables_servicio_servicioId_fkey" FOREIGN KEY ("servicioId") REFERENCES "servicios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pagos_ingresos" ADD CONSTRAINT "pagos_ingresos_servicioId_fkey" FOREIGN KEY ("servicioId") REFERENCES "servicios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logs"."logs_audit_logs" ADD CONSTRAINT "logs_audit_logs_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "auth_usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;
