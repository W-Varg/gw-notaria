-- CreateEnum
CREATE TYPE "EstadoPedido" AS ENUM ('PENDIENTE', 'CONFIRMADO', 'EN_PREPARACION', 'LISTO_PARA_ENTREGA', 'ENTREGADO', 'CANCELADO', 'REEMBOLSADO');

-- CreateEnum
CREATE TYPE "EstadoEntrega" AS ENUM ('PENDIENTE', 'PROGRAMADA', 'EN_CAMINO', 'ENTREGADA', 'CANCELADA');

-- CreateEnum
CREATE TYPE "UnidadMedida" AS ENUM ('Gramos', 'Klg', 'Unidad', 'Caja', 'Paquete');

-- CreateEnum
CREATE TYPE "DiaSemana" AS ENUM ('Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo');

-- CreateEnum
CREATE TYPE "TipoClienteEnum" AS ENUM ('NATURAL', 'JURIDICA');

-- CreateEnum
CREATE TYPE "MetodoPagoEnum" AS ENUM ('EFECTIVO', 'QR', 'TRANSFERENCIA', 'CHEQUE', 'DEPOSITO');

-- CreateEnum
CREATE TYPE "ConstanciaEnum" AS ENUM ('RECIBO', 'FACTURA');

-- CreateTable
CREATE TABLE "auth_roles" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "estaActivo" BOOLEAN NOT NULL DEFAULT true,
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
    "id" TEXT NOT NULL,
    "email" VARCHAR(150) NOT NULL,
    "password" VARCHAR(150) NOT NULL,
    "nombre" VARCHAR(30) NOT NULL,
    "apellidos" VARCHAR(30) NOT NULL,
    "telefono" VARCHAR(10),
    "direccion" TEXT,
    "avatar" TEXT,
    "estaActivo" BOOLEAN NOT NULL DEFAULT true,
    "emailVerificado" BOOLEAN NOT NULL DEFAULT false,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaActualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "auth_usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth_usuario_roles" (
    "id" SERIAL NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "rolId" INTEGER NOT NULL,

    CONSTRAINT "auth_usuario_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cat_categorias" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "imagen" TEXT,
    "estaActiva" BOOLEAN NOT NULL DEFAULT true,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaActualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cat_categorias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cat_tipos_producto" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "cat_tipos_producto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prod_productos" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" VARCHAR(500),
    "precio" DOUBLE PRECISION NOT NULL,
    "peso" DOUBLE PRECISION NOT NULL,
    "unidad" "UnidadMedida" NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "codigoSKU" TEXT NOT NULL,
    "estaActivo" BOOLEAN NOT NULL DEFAULT true,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaActualizacion" TIMESTAMP(3) NOT NULL,
    "tipoProductoId" TEXT NOT NULL,
    "categoriaId" TEXT NOT NULL,

    CONSTRAINT "prod_productos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "int_mensajes_contacto" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT,
    "nombre" TEXT NOT NULL,
    "correo" TEXT NOT NULL,
    "telefono" TEXT,
    "asunto" TEXT NOT NULL,
    "mensaje" TEXT NOT NULL,
    "categoria" TEXT NOT NULL DEFAULT 'consulta',
    "estado" TEXT NOT NULL DEFAULT 'no_leido',
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaActualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "int_mensajes_contacto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_configuracion_sistema" (
    "id" TEXT NOT NULL,
    "clave" TEXT NOT NULL,
    "valor" TEXT NOT NULL,
    "tipo" TEXT NOT NULL DEFAULT 'texto',
    "descripcion" TEXT,
    "fechaActualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "_configuracion_sistema_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bancos" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,

    CONSTRAINT "bancos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cuentas_bancarias" (
    "id" SERIAL NOT NULL,
    "bancoId" INTEGER NOT NULL,
    "numeroCuenta" VARCHAR(50) NOT NULL,
    "tipoCuenta" VARCHAR(50),
    "saldoActual" DECIMAL(12,2) NOT NULL DEFAULT 0.00,

    CONSTRAINT "cuentas_bancarias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tipos_documento" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "precioBase" DECIMAL(10,2) NOT NULL DEFAULT 0.00,

    CONSTRAINT "tipos_documento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plantillas_documento" (
    "id" SERIAL NOT NULL,
    "tipoDocumentoId" INTEGER NOT NULL,
    "nombrePlantilla" VARCHAR(100),
    "contenidoHtml" TEXT,

    CONSTRAINT "plantillas_documento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "estados_tramite" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "colorHex" VARCHAR(10),

    CONSTRAINT "estados_tramite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clientes" (
    "id" SERIAL NOT NULL,
    "tipo" "TipoClienteEnum" NOT NULL,
    "direccion" VARCHAR(255),
    "telefono" VARCHAR(20),
    "email" VARCHAR(100),
    "fechaRegistro" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "clientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "personas_naturales" (
    "clienteId" INTEGER NOT NULL,
    "ci" VARCHAR(20),
    "expedido" VARCHAR(10),
    "nombres" VARCHAR(100) NOT NULL,
    "apellidos" VARCHAR(100) NOT NULL,
    "fechaNacimiento" DATE,

    CONSTRAINT "personas_naturales_pkey" PRIMARY KEY ("clienteId")
);

-- CreateTable
CREATE TABLE "personas_juridicas" (
    "clienteId" INTEGER NOT NULL,
    "nit" VARCHAR(20),
    "razonSocial" VARCHAR(150) NOT NULL,
    "representanteLegal" VARCHAR(150),

    CONSTRAINT "personas_juridicas_pkey" PRIMARY KEY ("clienteId")
);

-- CreateTable
CREATE TABLE "servicios" (
    "id" SERIAL NOT NULL,
    "codigoTicket" VARCHAR(20) NOT NULL,
    "clienteId" INTEGER NOT NULL,
    "tipoDocumentoId" INTEGER NOT NULL,
    "claseTramite" VARCHAR(50),
    "tipoTramite" VARCHAR(50),
    "negocio" VARCHAR(50),
    "fechaInicio" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "observaciones" TEXT,
    "contenidoFinal" TEXT,
    "montoTotal" DECIMAL(10,2) NOT NULL,
    "saldoPendiente" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "servicios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "historial_estados_servicio" (
    "id" SERIAL NOT NULL,
    "usuarioId" TEXT,
    "servicioId" INTEGER NOT NULL,
    "estadoId" INTEGER NOT NULL,
    "fechaCambio" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "comentario" VARCHAR(255),

    CONSTRAINT "historial_estados_servicio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "responsables_servicio" (
    "id" SERIAL NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "servicioId" INTEGER NOT NULL,
    "fechaAsignacion" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaBaja" TIMESTAMP(3),
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "responsables_servicio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pagos_ingresos" (
    "id" SERIAL NOT NULL,
    "servicioId" INTEGER,
    "fecha" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "monto" DECIMAL(10,2) NOT NULL,
    "tipoPago" "MetodoPagoEnum" NOT NULL,
    "cuentaBancariaId" INTEGER,
    "constanciaTipo" "ConstanciaEnum",
    "numeroConstancia" VARCHAR(50),
    "concepto" VARCHAR(255),
    "usuarioRegistroId" TEXT,

    CONSTRAINT "pagos_ingresos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gastos" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "descripcion" TEXT,
    "proveedor" VARCHAR(100),
    "montoTotal" DECIMAL(10,2) NOT NULL,
    "montoPagado" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "saldo" DECIMAL(10,2),
    "fechaGasto" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "categoria" VARCHAR(50),
    "usuarioId" TEXT,

    CONSTRAINT "gastos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transacciones_egresos" (
    "id" SERIAL NOT NULL,
    "gastoId" INTEGER NOT NULL,
    "monto" DECIMAL(10,2) NOT NULL,
    "fecha" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cuentaBancariaId" INTEGER,
    "metodoPago" "MetodoPagoEnum" NOT NULL,

    CONSTRAINT "transacciones_egresos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "arqueos_diarios" (
    "id" SERIAL NOT NULL,
    "fecha" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuarioCierreId" TEXT,
    "totalIngresosEfectivo" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "totalIngresosBancos" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "totalEgresosEfectivo" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "totalEgresosBancos" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "saldoFinalDia" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "observaciones" TEXT,
    "fechaCierre" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "arqueos_diarios_pkey" PRIMARY KEY ("id")
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
CREATE UNIQUE INDEX "cat_categorias_nombre_key" ON "cat_categorias"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "cat_tipos_producto_nombre_key" ON "cat_tipos_producto"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "prod_productos_codigoSKU_key" ON "prod_productos"("codigoSKU");

-- CreateIndex
CREATE UNIQUE INDEX "_configuracion_sistema_clave_key" ON "_configuracion_sistema"("clave");

-- CreateIndex
CREATE UNIQUE INDEX "personas_naturales_ci_key" ON "personas_naturales"("ci");

-- CreateIndex
CREATE UNIQUE INDEX "personas_juridicas_nit_key" ON "personas_juridicas"("nit");

-- CreateIndex
CREATE UNIQUE INDEX "servicios_codigoTicket_key" ON "servicios"("codigoTicket");

-- CreateIndex
CREATE UNIQUE INDEX "arqueos_diarios_fecha_key" ON "arqueos_diarios"("fecha");

-- AddForeignKey
ALTER TABLE "auth_rol_permisos" ADD CONSTRAINT "auth_rol_permisos_rolId_fkey" FOREIGN KEY ("rolId") REFERENCES "auth_roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth_rol_permisos" ADD CONSTRAINT "auth_rol_permisos_permisoId_fkey" FOREIGN KEY ("permisoId") REFERENCES "auth_permisos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth_usuario_roles" ADD CONSTRAINT "auth_usuario_roles_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "auth_usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth_usuario_roles" ADD CONSTRAINT "auth_usuario_roles_rolId_fkey" FOREIGN KEY ("rolId") REFERENCES "auth_roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prod_productos" ADD CONSTRAINT "prod_productos_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "cat_categorias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prod_productos" ADD CONSTRAINT "prod_productos_tipoProductoId_fkey" FOREIGN KEY ("tipoProductoId") REFERENCES "cat_tipos_producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "int_mensajes_contacto" ADD CONSTRAINT "int_mensajes_contacto_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "auth_usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cuentas_bancarias" ADD CONSTRAINT "cuentas_bancarias_bancoId_fkey" FOREIGN KEY ("bancoId") REFERENCES "bancos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

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
ALTER TABLE "historial_estados_servicio" ADD CONSTRAINT "historial_estados_servicio_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "auth_usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historial_estados_servicio" ADD CONSTRAINT "historial_estados_servicio_servicioId_fkey" FOREIGN KEY ("servicioId") REFERENCES "servicios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historial_estados_servicio" ADD CONSTRAINT "historial_estados_servicio_estadoId_fkey" FOREIGN KEY ("estadoId") REFERENCES "estados_tramite"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "responsables_servicio" ADD CONSTRAINT "responsables_servicio_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "auth_usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "responsables_servicio" ADD CONSTRAINT "responsables_servicio_servicioId_fkey" FOREIGN KEY ("servicioId") REFERENCES "servicios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pagos_ingresos" ADD CONSTRAINT "pagos_ingresos_servicioId_fkey" FOREIGN KEY ("servicioId") REFERENCES "servicios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pagos_ingresos" ADD CONSTRAINT "pagos_ingresos_cuentaBancariaId_fkey" FOREIGN KEY ("cuentaBancariaId") REFERENCES "cuentas_bancarias"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pagos_ingresos" ADD CONSTRAINT "pagos_ingresos_usuarioRegistroId_fkey" FOREIGN KEY ("usuarioRegistroId") REFERENCES "auth_usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gastos" ADD CONSTRAINT "gastos_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "auth_usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transacciones_egresos" ADD CONSTRAINT "transacciones_egresos_gastoId_fkey" FOREIGN KEY ("gastoId") REFERENCES "gastos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transacciones_egresos" ADD CONSTRAINT "transacciones_egresos_cuentaBancariaId_fkey" FOREIGN KEY ("cuentaBancariaId") REFERENCES "cuentas_bancarias"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "arqueos_diarios" ADD CONSTRAINT "arqueos_diarios_usuarioCierreId_fkey" FOREIGN KEY ("usuarioCierreId") REFERENCES "auth_usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;
