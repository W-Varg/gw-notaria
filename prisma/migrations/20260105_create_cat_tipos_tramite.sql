-- CreateTable
CREATE TABLE IF NOT EXISTS "cat_tipos_tramite" (
    "id" TEXT NOT NULL,
    "tipoDocumentoId" TEXT,
    "nombre" VARCHAR(255) NOT NULL,
    "descripcion" TEXT,
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

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "cat_tipos_tramite_nombre_key" ON "cat_tipos_tramite"("nombre");

-- AddForeignKey
ALTER TABLE "cat_tipos_tramite" 
ADD CONSTRAINT "cat_tipos_tramite_tipoDocumentoId_fkey" 
FOREIGN KEY ("tipoDocumentoId") REFERENCES "tipos_documento"("id") 
ON DELETE SET NULL ON UPDATE CASCADE;
