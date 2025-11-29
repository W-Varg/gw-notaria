import { PrismaClient, UnidadMedida } from '@prisma/client';

const prisma = new PrismaClient();

export async function createProductos(categorias: any[], tiposProducto: any[], imagenesDisponibles: string[]) {
  // Datos base para generar productos variados
  const productosBase = [
    // Alimentos (categoría 0)
    {
      nombre: 'Alimento Premium para Perro Adulto',
      descripcion: 'Alimento balanceado para perros adultos de todas las razas',
      precio: 150.0,
      peso: 1000,
      unidad: UnidadMedida.Klg,
      categoriaIndex: 0,
      tipoIndex: 0,
    },
    {
      nombre: 'Alimento Premium para Gato Adulto',
      descripcion: 'Alimento balanceado para gatos adultos con pollo',
      precio: 140.0,
      peso: 800,
      unidad: UnidadMedida.Gramos,
      categoriaIndex: 0,
      tipoIndex: 1,
    },
    {
      nombre: 'Croquetas para Perro Cachorro',
      descripcion: 'Alimento especial para perros en etapa de crecimiento',
      precio: 165.0,
      peso: 1200,
      unidad: UnidadMedida.Gramos,
      categoriaIndex: 0,
      tipoIndex: 0,
    },
    {
      nombre: 'Alimento para Gato Esterilizado',
      descripcion: 'Fórmula especial para gatos esterilizados',
      precio: 155.0,
      peso: 750,
      unidad: UnidadMedida.Gramos,
      categoriaIndex: 0,
      tipoIndex: 1,
    },
    {
      nombre: 'Comida Húmeda para Perro',
      descripcion: 'Lata de comida húmeda con carne y verduras',
      precio: 25.0,
      peso: 400,
      unidad: UnidadMedida.Gramos,
      categoriaIndex: 0,
      tipoIndex: 0,
    },
    {
      nombre: 'Comida Húmeda para Gato',
      descripcion: 'Lata de comida húmeda con salmón',
      precio: 22.0,
      peso: 85,
      unidad: UnidadMedida.Gramos,
      categoriaIndex: 0,
      tipoIndex: 1,
    },

    // Accesorios (categoría 1)
    {
      nombre: 'Collar para Perro Mediano',
      descripcion: 'Collar ajustable de nylon resistente',
      precio: 45.0,
      peso: 50,
      unidad: UnidadMedida.Unidad,
      categoriaIndex: 1,
      tipoIndex: 0,
    },
    {
      nombre: 'Collar para Gato',
      descripcion: 'Collar ajustable con cascabel',
      precio: 35.0,
      peso: 30,
      unidad: UnidadMedida.Unidad,
      categoriaIndex: 1,
      tipoIndex: 1,
    },
    {
      nombre: 'Correa Retráctil para Perro',
      descripcion: 'Correa retráctil de 5 metros con freno',
      precio: 120.0,
      peso: 350,
      unidad: UnidadMedida.Unidad,
      categoriaIndex: 1,
      tipoIndex: 0,
    },
    {
      nombre: 'Arnés para Perro Pequeño',
      descripcion: 'Arnés cómodo y seguro para perros pequeños',
      precio: 65.0,
      peso: 80,
      unidad: UnidadMedida.Unidad,
      categoriaIndex: 1,
      tipoIndex: 0,
    },
    {
      nombre: 'Cama para Perro Mediano',
      descripcion: 'Cama ortopédica con relleno de espuma',
      precio: 180.0,
      peso: 2000,
      unidad: UnidadMedida.Unidad,
      categoriaIndex: 1,
      tipoIndex: 0,
    },
    {
      nombre: 'Rascador para Gato',
      descripcion: 'Rascador de cartón con plataforma',
      precio: 85.0,
      peso: 1500,
      unidad: UnidadMedida.Unidad,
      categoriaIndex: 1,
      tipoIndex: 1,
    },
    {
      nombre: 'Transportadora para Mascotas',
      descripcion: 'Transportadora plegable con ventilación',
      precio: 95.0,
      peso: 1200,
      unidad: UnidadMedida.Unidad,
      categoriaIndex: 1,
      tipoIndex: 0, // Aplicable a perros y gatos
    },
    {
      nombre: 'Plato Doble para Mascotas',
      descripcion: 'Plato elevado doble con base antideslizante',
      precio: 40.0,
      peso: 300,
      unidad: UnidadMedida.Unidad,
      categoriaIndex: 1,
      tipoIndex: 0,
    },

    // Higiene (categoría 2)
    {
      nombre: 'Shampoo para Perro Antipulgas',
      descripcion: 'Shampoo medicinal contra pulgas y garrapatas',
      precio: 75.0,
      peso: 300,
      unidad: UnidadMedida.Gramos,
      categoriaIndex: 2,
      tipoIndex: 0,
    },
    {
      nombre: 'Shampoo para Gato',
      descripcion: 'Shampoo suave para gatos con aroma a vainilla',
      precio: 65.0,
      peso: 250,
      unidad: UnidadMedida.Gramos,
      categoriaIndex: 2,
      tipoIndex: 1,
    },
    {
      nombre: 'Cepillo para Perro',
      descripcion: 'Cepillo de cerdas naturales para desenredar',
      precio: 35.0,
      peso: 100,
      unidad: UnidadMedida.Unidad,
      categoriaIndex: 2,
      tipoIndex: 0,
    },
    {
      nombre: 'Cortaúñas para Perro',
      descripcion: 'Cortaúñas profesional con guía de seguridad',
      precio: 55.0,
      peso: 80,
      unidad: UnidadMedida.Unidad,
      categoriaIndex: 2,
      tipoIndex: 0,
    },
    {
      nombre: 'Toallitas Húmedas para Mascotas',
      descripcion: 'Paquete de 50 toallitas desinfectantes',
      precio: 25.0,
      peso: 200,
      unidad: UnidadMedida.Unidad,
      categoriaIndex: 2,
      tipoIndex: 0,
    },
    {
      nombre: 'Arena Sanitaria para Gato',
      descripcion: 'Arena absorbente con control de olores',
      precio: 45.0,
      peso: 5000,
      unidad: UnidadMedida.Gramos,
      categoriaIndex: 2,
      tipoIndex: 1,
    },
    {
      nombre: 'Desodorante Ambiental para Mascotas',
      descripcion: 'Spray neutralizador de olores',
      precio: 35.0,
      peso: 200,
      unidad: UnidadMedida.Gramos,
      categoriaIndex: 2,
      tipoIndex: 0,
    },

    // Juguetes (categoría 3)
    {
      nombre: 'Pelota de Goma para Perro',
      descripcion: 'Pelota resistente al masticado',
      precio: 20.0,
      peso: 150,
      unidad: UnidadMedida.Unidad,
      categoriaIndex: 3,
      tipoIndex: 0,
    },
    {
      nombre: 'Ratoncito de Juguete para Gato',
      descripcion: 'Juguete con plumas y cascabel',
      precio: 15.0,
      peso: 50,
      unidad: UnidadMedida.Unidad,
      categoriaIndex: 3,
      tipoIndex: 1,
    },
    {
      nombre: 'Hueso de Goma para Perro',
      descripcion: 'Hueso masticable de goma natural',
      precio: 30.0,
      peso: 200,
      unidad: UnidadMedida.Unidad,
      categoriaIndex: 3,
      tipoIndex: 0,
    },
    {
      nombre: 'Túnel Interactivo para Gato',
      descripcion: 'Túnel plegable con juguetes colgantes',
      precio: 70.0,
      peso: 800,
      unidad: UnidadMedida.Unidad,
      categoriaIndex: 3,
      tipoIndex: 1,
    },
    {
      nombre: 'Cuerda Trenzada para Perro',
      descripcion: 'Juguete de cuerda resistente para tirar',
      precio: 25.0,
      peso: 100,
      unidad: UnidadMedida.Unidad,
      categoriaIndex: 3,
      tipoIndex: 0,
    },
    {
      nombre: 'Varita con Plumas para Gato',
      descripcion: 'Varita interactiva con plumas de colores',
      precio: 18.0,
      peso: 30,
      unidad: UnidadMedida.Unidad,
      categoriaIndex: 3,
      tipoIndex: 1,
    },
    {
      nombre: 'Kong para Perro',
      descripcion: 'Juguete rellenable con premios',
      precio: 45.0,
      peso: 150,
      unidad: UnidadMedida.Unidad,
      categoriaIndex: 3,
      tipoIndex: 0,
    },
    {
      nombre: 'Caja de Juguetes para Gato',
      descripcion: 'Set de 5 juguetes variados para gatos',
      precio: 55.0,
      peso: 300,
      unidad: UnidadMedida.Unidad,
      categoriaIndex: 3,
      tipoIndex: 1,
    },

    // Productos adicionales para llegar a 30
    {
      nombre: 'Suplemento Nutricional para Perro',
      descripcion: 'Vitaminas y minerales para perros adultos',
      precio: 85.0,
      peso: 100,
      unidad: UnidadMedida.Gramos,
      categoriaIndex: 0,
      tipoIndex: 0,
    },
    {
      nombre: 'Champú Seco para Mascotas',
      descripcion: 'Champú en polvo para limpieza rápida',
      precio: 40.0,
      peso: 150,
      unidad: UnidadMedida.Gramos,
      categoriaIndex: 2,
      tipoIndex: 0,
    },
    {
      nombre: 'Jaula para Perro Mediano',
      descripcion: 'Jaula plegable con bandeja extraíble',
      precio: 250.0,
      peso: 5000,
      unidad: UnidadMedida.Unidad,
      categoriaIndex: 1,
      tipoIndex: 0,
    },
    {
      nombre: 'Snacks Dentales para Perro',
      descripcion: 'Galletas que ayudan a limpiar los dientes',
      precio: 35.0,
      peso: 200,
      unidad: UnidadMedida.Gramos,
      categoriaIndex: 0,
      tipoIndex: 0,
    },
    {
      nombre: 'Cepillo Eléctrico para Mascotas',
      descripcion: 'Cepillo rotativo para un cepillado eficiente',
      precio: 90.0,
      peso: 120,
      unidad: UnidadMedida.Unidad,
      categoriaIndex: 2,
      tipoIndex: 0,
    },
  ];

  const productosCreados = [];

  for (let i = 0; i < productosBase.length; i++) {
    const productoBase = productosBase[i];
    const categoria = categorias[productoBase.categoriaIndex];
    const tipoProducto = tiposProducto[productoBase.tipoIndex];

    if (!categoria || !tipoProducto) {
      console.warn(`Saltando producto ${productoBase.nombre}: categoría o tipo no encontrado`);
      continue;
    }

    // Seleccionar imagen aleatoria del array disponible
    const imagenAleatoria = imagenesDisponibles[Math.floor(Math.random() * imagenesDisponibles.length)];
    const urlImagen = `/storage/productos/${imagenAleatoria}`;

    const productoCreado = await prisma.producto.create({
      data: {
        nombre: productoBase.nombre,
        descripcion: productoBase.descripcion,
        precio: productoBase.precio,
        peso: productoBase.peso,
        unidad: productoBase.unidad,
        codigoSKU: `PROD-${String(i + 1).padStart(3, '0')}`,
        categoriaId: categoria.id,
        tipoProductoId: tipoProducto.id,
        imagenes: {
          create: {
            url: urlImagen,
            esPrincipal: true,
          },
        },
      },
    });
    productosCreados.push(productoCreado);
  }

  console.info(`Created ${productosCreados.length} productos`);
  return productosCreados;
}