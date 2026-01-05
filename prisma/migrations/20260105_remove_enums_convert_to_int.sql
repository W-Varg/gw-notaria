-- Migración: Eliminar enums de PostgreSQL y convertir a Int
-- Fecha: 2026-01-05

BEGIN;

-- ============================================
-- 1. CONVERSIÓN DE MetodoPagoEnum
-- ============================================

-- Convertir TransaccionesEgresos.metodoPago a Int
ALTER TABLE "transacciones_egresos" 
  ALTER COLUMN "metodoPago" TYPE INTEGER USING (
    CASE "metodoPago"::text
      WHEN 'EFECTIVO' THEN 1
      WHEN 'QR' THEN 2
      WHEN 'TRANSFERENCIA' THEN 3
      WHEN 'CHEQUE' THEN 4
      WHEN 'DEPOSITO' THEN 5
      ELSE 1
    END
  );

-- Convertir PagosIngresos.tipoPago a Int
ALTER TABLE "pagos_ingresos" 
  ALTER COLUMN "tipoPago" TYPE INTEGER USING (
    CASE "tipoPago"::text
      WHEN 'EFECTIVO' THEN 1
      WHEN 'QR' THEN 2
      WHEN 'TRANSFERENCIA' THEN 3
      WHEN 'CHEQUE' THEN 4
      WHEN 'DEPOSITO' THEN 5
      ELSE 1
    END
  );

-- Eliminar enum MetodoPagoEnum si existe
DROP TYPE IF EXISTS "MetodoPagoEnum" CASCADE;

-- ============================================
-- 2. CONVERSIÓN DE TipoClienteEnum
-- ============================================

-- Convertir Cliente.tipo a Int (si existe como enum)
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_type WHERE typname = 'TipoClienteEnum'
  ) THEN
    ALTER TABLE "clientes" 
      ALTER COLUMN "tipo" TYPE INTEGER USING (
        CASE "tipo"::text
          WHEN 'NATURAL' THEN 1
          WHEN 'JURIDICA' THEN 2
          ELSE 1
        END
      );
    
    DROP TYPE IF EXISTS "TipoClienteEnum" CASCADE;
  END IF;
END $$;

-- ============================================
-- 3. CONVERSIÓN DE TipoAccionEnum (AuditLog)
-- ============================================

DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_type WHERE typname = 'TipoAccionEnum'
  ) THEN
    ALTER TABLE logs."logs_audit_logs" 
      ALTER COLUMN "accion" TYPE INTEGER USING (
        CASE "accion"::text
          WHEN 'CREATE' THEN 1
          WHEN 'UPDATE' THEN 2
          WHEN 'DELETE' THEN 3
          WHEN 'READ' THEN 4
          WHEN 'LOGIN' THEN 5
          WHEN 'LOGOUT' THEN 6
          WHEN 'EXPORT' THEN 7
          WHEN 'IMPORT' THEN 8
          WHEN 'PRINT' THEN 9
          WHEN 'DOWNLOAD' THEN 10
          WHEN 'APPROVE' THEN 11
          WHEN 'REJECT' THEN 12
          WHEN 'ACTIVATE' THEN 13
          WHEN 'DEACTIVATE' THEN 14
          WHEN 'RESTORE' THEN 15
          WHEN 'CUSTOM' THEN 16
          WHEN 'PASSWORD_CHANGE' THEN 17
          ELSE 1
        END
      );
    
    DROP TYPE IF EXISTS "TipoAccionEnum" CASCADE;
  END IF;
END $$;

-- ============================================
-- 4. CONVERSIÓN DE NivelLogEnum (SystemLog)
-- ============================================

DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_type WHERE typname = 'NivelLogEnum'
  ) THEN
    -- Eliminar default antes de convertir
    ALTER TABLE logs."logs_system_logs" 
      ALTER COLUMN "nivel" DROP DEFAULT;
    
    -- Convertir a INTEGER
    ALTER TABLE logs."logs_system_logs" 
      ALTER COLUMN "nivel" TYPE INTEGER USING (
        CASE "nivel"::text
          WHEN 'INFO' THEN 1
          WHEN 'WARNING' THEN 2
          WHEN 'ERROR' THEN 3
          WHEN 'CRITICAL' THEN 4
          WHEN 'DEBUG' THEN 5
          ELSE 1
        END
      );
    
    -- Restaurar default con valor INT
    ALTER TABLE logs."logs_system_logs" 
      ALTER COLUMN "nivel" SET DEFAULT 1;
    
    DROP TYPE IF EXISTS "NivelLogEnum" CASCADE;
  END IF;
END $$;

COMMIT;
