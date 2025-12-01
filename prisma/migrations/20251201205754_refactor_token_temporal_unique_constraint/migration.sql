/*
  Warnings:

  - You are about to drop the `_configuracion_sistema` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "_configuracion_sistema";

-- CreateTable
CREATE TABLE "_tokens_temporales" (
    "id" TEXT NOT NULL,
    "clave" TEXT NOT NULL,
    "valor" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "metadatos" JSONB,
    "fechaExpiracion" TIMESTAMP(3) NOT NULL,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "_tokens_temporales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_configuracion_aplicacion" (
    "id" TEXT NOT NULL,
    "clave" TEXT NOT NULL,
    "valor" TEXT NOT NULL,
    "tipo" TEXT NOT NULL DEFAULT 'texto',
    "categoria" TEXT NOT NULL DEFAULT 'general',
    "descripcion" TEXT,
    "esEditable" BOOLEAN NOT NULL DEFAULT true,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaActualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "_configuracion_aplicacion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "_tokens_temporales_usuarioId_idx" ON "_tokens_temporales"("usuarioId");

-- CreateIndex
CREATE INDEX "_tokens_temporales_fechaExpiracion_idx" ON "_tokens_temporales"("fechaExpiracion");

-- CreateIndex
CREATE INDEX "_tokens_temporales_tipo_idx" ON "_tokens_temporales"("tipo");

-- CreateIndex
CREATE UNIQUE INDEX "_tokens_temporales_usuarioId_tipo_key" ON "_tokens_temporales"("usuarioId", "tipo");

-- CreateIndex
CREATE UNIQUE INDEX "_configuracion_aplicacion_clave_key" ON "_configuracion_aplicacion"("clave");

-- CreateIndex
CREATE INDEX "_configuracion_aplicacion_categoria_idx" ON "_configuracion_aplicacion"("categoria");

-- AddForeignKey
ALTER TABLE "_tokens_temporales" ADD CONSTRAINT "_tokens_temporales_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "auth_usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
