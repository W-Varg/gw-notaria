-- Crear schema logs para auditoría
CREATE SCHEMA IF NOT EXISTS logs;

-- Dar permisos al usuario actual
GRANT ALL ON SCHEMA logs TO CURRENT_USER;
GRANT ALL ON ALL TABLES IN SCHEMA logs TO CURRENT_USER;
GRANT ALL ON ALL SEQUENCES IN SCHEMA logs TO CURRENT_USER;

-- Comentario del schema
COMMENT ON SCHEMA logs IS 'Schema dedicado para almacenar logs de auditoría y trazabilidad de la aplicación';
