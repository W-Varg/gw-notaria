# Flujos y Casos de Uso por Tipo de Usuario

## Introducción

Este documento describe los flujos y casos de uso para cada tipo de usuario en el sistema de e-commerce de artículos para mascotas (principalmente caninos). El sistema cuenta con tres tipos de usuarios principales:

1. **Empleados/Admin**: Usuarios con acceso completo al sistema, incluyendo módulos administrativos protegidos por permisos.
2. **Clientes Registrados**: Usuarios que se registran y loguean para acceder a funcionalidades personalizadas y protegidas por token.
3. **Clientes Públicos/Invitados**: Usuarios que no requieren autenticación y acceden solo a contenido público.

Los flujos están agrupados por tipo de usuario y se basan en los módulos del backend: `admin`, `client_portal` y `public_portal`. Cada flujo incluye pasos detallados, casos de uso y consideraciones de seguridad.

## 1. Empleados/Admin

Los empleados/admin tienen acceso completo a todas las funcionalidades del sistema. Pueden gestionar inventarios, pedidos, usuarios, configuraciones y más. Requieren autenticación y permisos específicos basados en roles.

### 1.1 Gestión de Catálogos y Productos
**Caso de Uso**: Administrar categorías, tipos de productos, productos y variantes.

- **Flujo**:
  1. Empleado se autentica con credenciales (email/password).
  2. Sistema valida permisos (roles y permisos asignados).
  3. Accede al módulo de catálogos.
  4. Crea/edita/elimina categorías (ej: "Alimentos", "Juguetes", "Accesorios").
  5. Gestiona tipos de productos (ej: "Comida seca", "Comida húmeda").
  6. Administra productos: crea productos con detalles (nombre, descripción, precio, imágenes).
  7. Gestiona variantes de productos (tamaño, sabor, color) y inventario por variante.
  8. Sube imágenes de productos.
  9. Sistema actualiza base de datos y refleja cambios en inventario.

**Casos de Uso Específicos**:
- Crear nueva categoría.
- Editar producto existente.
- Eliminar variante de producto.
- Gestionar inventario por sucursal.

### 1.2 Gestión de Inventarios y Sucursales
**Caso de Uso**: Controlar stock, movimientos de inventario y sucursales.

- **Flujo**:
  1. Autenticación y validación de permisos.
  2. Accede a módulo de inventarios.
  3. Consulta stock actual por producto/variante y sucursal.
  4. Registra movimientos de inventario (entrada, salida, ajustes).
  5. Gestiona sucursales: crea/edita sucursales con horarios de atención.
  6. Asigna empleados a sucursales.
  7. Sistema actualiza inventario en tiempo real y genera alertas de stock bajo.

**Casos de Uso Específicos**:
- Registrar entrada de mercancía.
- Transferir stock entre sucursales.
- Configurar horarios de sucursal.
- Asignar empleado a sucursal.

### 1.3 Gestión de Pedidos y Entregas
**Caso de Uso**: Procesar pedidos, gestionar entregas y reservas.

- **Flujo**:
  1. Autenticación y permisos.
  2. Accede a módulo de pedidos.
  3. Consulta lista de pedidos pendientes/confirmados.
  4. Actualiza estado de pedido (pendiente → confirmado → preparando → listo → entregado).
  5. Gestiona entregas: asigna entregas a empleados, actualiza estado de entrega.
  6. Maneja reservas de productos/servicios.
  7. Procesa reembolsos o cancelaciones.
  8. Sistema notifica cambios a clientes vía email/webhook.

**Casos de Uso Específicos**:
- Confirmar pedido de cliente.
- Asignar entrega a repartidor.
- Cancelar pedido y procesar reembolso.
- Gestionar reserva de servicio (ej: baño para perro).

### 1.4 Gestión de Usuarios y Seguridad
**Caso de Uso**: Administrar usuarios, roles, permisos y empleados.

- **Flujo**:
  1. Autenticación con permisos elevados.
  2. Accede a módulo de seguridad.
  3. Gestiona usuarios: crea/edita/elimina usuarios (clientes, empleados).
  4. Asigna roles y permisos a usuarios.
  5. Gestiona empleados: contrata, asigna sucursales, configura salarios.
  6. Verifica/verifica emails de usuarios.
  7. Sistema audita cambios para seguridad.

**Casos de Uso Específicos**:
- Crear nuevo empleado.
- Asignar rol de "Gerente" a usuario.
- Resetear contraseña de cliente.
- Desactivar usuario por inactividad.

### 1.5 Monitoreo y Notificaciones
**Caso de Uso**: Supervisar sistema y gestionar alertas.

- **Flujo**:
  1. Autenticación.
  2. Accede a módulo de monitoreo.
  3. Consulta métricas de sistema (ventas, inventario, usuarios).
  4. Gestiona alertas de stock bajo.
  5. Configura notificaciones (email, webhook) para eventos.
  6. Maneja mensajes de contacto de clientes.
  7. Sistema envía notificaciones automáticas.

**Casos de Uso Específicos**:
- Revisar dashboard de ventas.
- Configurar alerta para producto con stock crítico.
- Responder mensaje de contacto.

### 1.6 Gestión de Servicios y Configuración
**Caso de Uso**: Administrar servicios ofrecidos y configuraciones del sistema.

- **Flujo**:
  1. Autenticación.
  2. Accede a módulo de tienda.
  3. Gestiona servicios (ej: grooming, vacunación).
  4. Configura información de tienda (horarios, contacto).
  5. Actualiza configuraciones del sistema (impuestos, métodos de pago).
  6. Sube imágenes de servicios.
  7. Sistema refleja cambios en portal público.

**Casos de Uso Específicos**:
- Agregar nuevo servicio de grooming.
- Actualizar dirección de tienda.
- Configurar tasa de impuesto.

## 2. Clientes Registrados

Los clientes registrados deben loguearse para obtener un token JWT, permitiéndoles acceder a funcionalidades personalizadas. Pueden acceder a rutas públicas y protegidas por token en client_portal.

### 2.1 Autenticación y Perfil
**Caso de Uso**: Registrarse, loguearse y gestionar perfil personal.

- **Flujo**:
  1. Cliente se registra con email, password, nombre, etc.
  2. Sistema envía email de verificación.
  3. Cliente verifica email y se loguea.
  4. Obtiene token JWT para sesiones futuras.
  5. Accede a perfil: edita información personal, avatar, direcciones de entrega.
  6. Gestiona direcciones de entrega para pedidos.

**Casos de Uso Específicos**:
- Registro de nuevo cliente.
- Login con credenciales.
- Actualizar perfil (cambiar teléfono).
- Agregar nueva dirección de entrega.

### 2.2 Gestión del Carrito de Compras
**Caso de Uso**: Agregar productos al carrito y gestionarlo.

- **Flujo**:
  1. Cliente logueado (con token).
  2. Navega productos (accede a rutas públicas).
  3. Agrega productos/variantes al carrito.
  4. Edita cantidades, elimina items.
  5. Aplica descuentos/códigos promocionales (si implementado).
  6. Sistema calcula totales y guarda carrito por usuario.

**Casos de Uso Específicos**:
- Agregar producto al carrito.
- Modificar cantidad de item.
- Vaciar carrito.
- Aplicar código de descuento.

### 2.3 Realización de Pedidos
**Caso de Uso**: Convertir carrito en pedido y gestionar pedidos existentes.

- **Flujo**:
  1. Cliente con token accede a carrito.
  2. Revisa y confirma carrito.
  3. Selecciona dirección de entrega y método de pago.
  4. Crea pedido (estado inicial: pendiente).
  5. Sistema procesa pago (integración externa).
  6. Cliente consulta historial de pedidos.
  7. Actualiza estado de pedido (ej: cancelar si pendiente).

**Casos de Uso Específicos**:
- Crear pedido desde carrito.
- Consultar pedidos anteriores.
- Cancelar pedido pendiente.
- Ver detalles de entrega.

### 2.4 Gestión de Reservas
**Caso de Uso**: Reservar servicios para mascotas.

- **Flujo**:
  1. Cliente logueado.
  2. Consulta servicios disponibles (grooming, etc.).
  3. Selecciona servicio, fecha, sucursal.
  4. Crea reserva con items específicos (ej: baño completo).
  5. Sistema confirma disponibilidad y reserva.
  6. Cliente gestiona reservas existentes (cancelar, modificar).

**Casos de Uso Específicos**:
- Reservar cita para baño de perro.
- Consultar reservas activas.
- Cancelar reserva.

### 2.5 Reseñas y Comentarios
**Caso de Uso**: Dejar reseñas sobre productos/servicios.

- **Flujo**:
  1. Cliente con token.
  2. Después de compra/reserva, accede a sección de reseñas.
  3. Crea reseña con calificación y comentario.
  4. Edita/elimina reseñas propias.
  5. Sistema asocia reseña a usuario y producto/servicio.

**Casos de Uso Específicos**:
- Dejar reseña de producto comprado.
- Editar reseña existente.
- Ver reseñas propias.

### 2.6 Acceso a Contenido Público
**Caso de Uso**: Navegar productos, información y contacto (igual que invitados, pero con token para personalización).

- **Flujo**: Similar a invitados, pero sistema puede personalizar recomendaciones basadas en historial.

## 3. Clientes Públicos/Invitados

Los invitados no requieren autenticación. Acceden solo a rutas públicas en public_portal. Pueden navegar, contactar, pero no comprar o reservar sin registrarse.

### 3.1 Navegación de Productos
**Caso de Uso**: Explorar catálogo de productos.

- **Flujo**:
  1. Invitado accede al portal público.
  2. Navega categorías y tipos de productos.
  3. Consulta detalles de productos (descripción, precio, imágenes, variantes).
  4. Filtra/busca productos.
  5. Sistema muestra información sin requerir login.

**Casos de Uso Específicos**:
- Ver lista de productos por categoría.
- Buscar "comida para perros".
- Ver detalles de variante específica.

### 3.2 Información de Tienda y Servicios
**Caso de Uso**: Obtener información general de la tienda.

- **Flujo**:
  1. Accede a módulo de info.
  2. Consulta información de tienda (horarios, contacto, sucursales).
  3. Navega servicios ofrecidos (grooming, etc.).
  4. Ve imágenes de servicios.
  5. Sistema proporciona datos estáticos.

**Casos de Uso Específicos**:
- Ver horarios de sucursal.
- Consultar servicios disponibles.
- Obtener dirección de tienda.

### 3.3 Contacto y Mensajes
**Caso de Uso**: Enviar mensajes de contacto.

- **Flujo**:
  1. Invitado accede a formulario de contacto.
  2. Ingresa datos (nombre, email, mensaje).
  3. Envía mensaje.
  4. Sistema guarda mensaje en base de datos y notifica admins.

**Casos de Uso Específicos**:
- Enviar consulta sobre producto.
- Reportar problema.
- Solicitar información.

### 3.4 Ver Reseñas Públicas
**Caso de Uso**: Leer reseñas de otros clientes.

- **Flujo**:
  1. Accede a sección de reseñas.
  2. Consulta reseñas por producto/servicio.
  3. Filtra por calificación.
  4. Sistema muestra reseñas públicas.

**Casos de Uso Específicos**:
- Ver reseñas de un producto específico.
- Leer comentarios sobre servicio de grooming.

### 3.5 Registro/Invitación a Registrarse
**Caso de Uso**: Animar a registrarse para funcionalidades avanzadas.

- **Flujo**:
  1. Durante navegación, sistema muestra prompts para registrarse.
  2. Invitado puede iniciar proceso de registro desde portal público.
  3. Una vez registrado, obtiene acceso a client_portal.

**Casos de Uso Específicos**:
- Iniciar registro desde página de producto.
- Convertirse de invitado a cliente registrado.

## Consideraciones Generales

- **Seguridad**: Todos los accesos protegidos validan tokens/permisos. Empleados requieren roles específicos.
- **Notificaciones**: Sistema envía emails/webhooks para eventos importantes (pedidos, reservas).
- **Integraciones**: Pagos externos, envío de emails, subida de imágenes a S3.
- **Escalabilidad**: Flujos diseñados para múltiples sucursales y empleados.
- **Auditoría**: Cambios en admin se registran para trazabilidad.

Este documento cubre los flujos principales. Para implementaciones específicas, referirse al código de los módulos respectivos.