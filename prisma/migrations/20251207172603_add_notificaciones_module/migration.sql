/*
  Warnings:

  - You are about to drop the `cat_tipos_producto` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `prod_productos` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "prod_productos" DROP CONSTRAINT "prod_productos_categoriaId_fkey";

-- DropForeignKey
ALTER TABLE "prod_productos" DROP CONSTRAINT "prod_productos_tipoProductoId_fkey";

-- DropTable
DROP TABLE "cat_tipos_producto";

-- DropTable
DROP TABLE "prod_productos";

-- CreateTable
CREATE TABLE "notificaciones" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "titulo" VARCHAR(255) NOT NULL,
    "mensaje" TEXT NOT NULL,
    "tipo" VARCHAR(20) NOT NULL DEFAULT 'info',
    "leida" BOOLEAN NOT NULL DEFAULT false,
    "icono" VARCHAR(50),
    "ruta" VARCHAR(255),
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaActualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notificaciones_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "notificaciones_usuarioId_idx" ON "notificaciones"("usuarioId");

-- CreateIndex
CREATE INDEX "notificaciones_leida_idx" ON "notificaciones"("leida");

-- CreateIndex
CREATE INDEX "notificaciones_fechaCreacion_idx" ON "notificaciones"("fechaCreacion");

-- AddForeignKey
ALTER TABLE "notificaciones" ADD CONSTRAINT "notificaciones_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "auth_usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
