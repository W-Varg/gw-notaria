import { PrismaClient } from '../../src/generated/prisma/client';

export async function crearPlantillasDocumento(
  prisma: PrismaClient,
  adminUserId: string,
  tiposDocumento: any[],
) {
  await prisma.plantillaDocumento.createMany({
    data: [
      // Plantilla para Escritura Pública
      {
        tipoDocumentoId: tiposDocumento[0].id,
        nombrePlantilla: 'Escritura Pública - Compraventa de Inmueble',
        descripcion: 'Plantilla estándar para escrituras públicas de compraventa de bienes inmuebles',
        contenidoHtml: `
          <div class="documento-legal">
            <h1 style="text-align: center;">ESCRITURA PÚBLICA DE COMPRAVENTA</h1>
            <p><strong>N°: {{numero_escritura}}</strong></p>
            
            <p>En la ciudad de {{ciudad}}, a los {{dia}} días del mes de {{mes}} del año {{anio}}, ante mí, 
            <strong>{{nombre_notario}}</strong>, Notario de Fe Pública del Distrito Judicial de {{distrito}}, 
            con registro N° {{registro_notario}}, comparecen:</p>
            
            <h3>VENDEDOR:</h3>
            <p>{{nombre_vendedor}}, mayor de edad, de estado civil {{estado_civil_vendedor}}, 
            con Cédula de Identidad N° {{ci_vendedor}} expedida en {{lugar_expedicion_vendedor}}, 
            con domicilio en {{domicilio_vendedor}}.</p>
            
            <h3>COMPRADOR:</h3>
            <p>{{nombre_comprador}}, mayor de edad, de estado civil {{estado_civil_comprador}}, 
            con Cédula de Identidad N° {{ci_comprador}} expedida en {{lugar_expedicion_comprador}}, 
            con domicilio en {{domicilio_comprador}}.</p>
            
            <h3>OBJETO:</h3>
            <p>El VENDEDOR transfiere en venta real y perpetua al COMPRADOR, quien adquiere para sí, 
            el siguiente bien inmueble:</p>
            <ul>
              <li>Ubicación: {{direccion_inmueble}}</li>
              <li>Superficie: {{superficie}} m²</li>
              <li>Matrícula Computarizada: {{matricula}}</li>
              <li>Registro en Derechos Reales: {{registro_derechos_reales}}</li>
            </ul>
            
            <h3>PRECIO:</h3>
            <p>El precio de esta compraventa es la suma de {{precio_letras}} 
            (Bs. {{precio_numeros}}), que el COMPRADOR cancela en este acto.</p>
            
            <p>Leída que fue la presente escritura a las partes, la ratifican y firman junto conmigo, 
            de todo lo cual DOY FE.</p>
            
            <div style="margin-top: 50px;">
              <p>_________________________&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_________________________</p>
              <p style="text-align: center;">VENDEDOR&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;COMPRADOR</p>
            </div>
            
            <div style="margin-top: 50px;">
              <p>_________________________</p>
              <p>{{nombre_notario}}</p>
              <p>NOTARIO DE FE PÚBLICA</p>
            </div>
          </div>
        `,
        estaActiva: true,
        userCreateId: adminUserId,
      },

      // Plantilla para Poder Notarial
      {
        tipoDocumentoId: tiposDocumento[1].id,
        nombrePlantilla: 'Poder General Amplio',
        descripcion: 'Plantilla para poder general con amplias facultades',
        contenidoHtml: `
          <div class="documento-legal">
            <h1 style="text-align: center;">PODER GENERAL</h1>
            
            <p>Por el presente documento público, YO, {{nombre_poderdante}}, mayor de edad, 
            de estado civil {{estado_civil}}, con Cédula de Identidad N° {{ci_poderdante}} 
            expedida en {{lugar_expedicion}}, con domicilio en {{domicilio_poderdante}}, 
            confiero PODER GENERAL, amplio y suficiente a:</p>
            
            <p><strong>{{nombre_apoderado}}</strong>, mayor de edad, con Cédula de Identidad 
            N° {{ci_apoderado}} expedida en {{lugar_expedicion_apoderado}}, para que a mi nombre 
            y representación realice los siguientes actos:</p>
            
            <h3>FACULTADES:</h3>
            <ul>
              <li>Administrar todos mis bienes muebles e inmuebles</li>
              <li>Realizar operaciones bancarias, abrir y cerrar cuentas</li>
              <li>Cobrar, percibir y dar finiquitos</li>
              <li>Comparecer ante autoridades judiciales y administrativas</li>
              <li>Firmar contratos y documentos</li>
              <li>Comprar, vender y gravar bienes</li>
              <li>{{facultades_adicionales}}</li>
            </ul>
            
            <p>Este poder tiene vigencia de {{vigencia}} años a partir de la presente fecha.</p>
            
            <p>En fe de lo cual, firmo el presente poder en la ciudad de {{ciudad}}, 
            a los {{dia}} días del mes de {{mes}} del año {{anio}}.</p>
            
            <div style="margin-top: 50px;">
              <p>_________________________</p>
              <p>{{nombre_poderdante}}</p>
              <p>PODERDANTE</p>
            </div>
          </div>
        `,
        estaActiva: true,
        userCreateId: adminUserId,
      },

      // Plantilla para Certificación
      {
        tipoDocumentoId: tiposDocumento[2].id,
        nombrePlantilla: 'Certificación de Documentos',
        descripcion: 'Plantilla para certificación notarial de documentos',
        contenidoHtml: `
          <div class="documento-legal">
            <h1 style="text-align: center;">CERTIFICACIÓN NOTARIAL</h1>
            
            <p>El suscrito, <strong>{{nombre_notario}}</strong>, Notario de Fe Pública 
            del Distrito Judicial de {{distrito}}, con registro N° {{registro_notario}}, 
            CERTIFICO que:</p>
            
            <p>He tenido a la vista el documento original consistente en:</p>
            <p><strong>{{tipo_documento}}</strong> emitido por {{entidad_emisora}} 
            a nombre de {{nombre_titular}}.</p>
            
            <p>La fotocopia que antecede es FIEL Y EXACTA reproducción del documento original 
            que tuve a la vista, el cual fue exhibido por {{nombre_solicitante}}.</p>
            
            <p>Expido la presente certificación a solicitud del interesado para los fines 
            legales que estime conveniente, en la ciudad de {{ciudad}}, 
            a los {{dia}} días del mes de {{mes}} del año {{anio}}.</p>
            
            <div style="margin-top: 50px;">
              <p>_________________________</p>
              <p>{{nombre_notario}}</p>
              <p>NOTARIO DE FE PÚBLICA</p>
              <p>Registro N° {{registro_notario}}</p>
            </div>
            
            <div style="margin-top: 30px; border: 2px solid #000; padding: 10px;">
              <p style="text-align: center;"><strong>SELLO NOTARIAL</strong></p>
            </div>
          </div>
        `,
        estaActiva: true,
        userCreateId: adminUserId,
      },

      // Plantilla para Testamento
      {
        tipoDocumentoId: tiposDocumento[5].id,
        nombrePlantilla: 'Testamento Cerrado',
        descripcion: 'Plantilla para testamento cerrado protocolizado',
        contenidoHtml: `
          <div class="documento-legal">
            <h1 style="text-align: center;">TESTAMENTO CERRADO</h1>
            
            <p>En la ciudad de {{ciudad}}, a los {{dia}} días del mes de {{mes}} del año {{anio}}, 
            ante mí, <strong>{{nombre_notario}}</strong>, Notario de Fe Pública, 
            comparece {{nombre_testador}}, mayor de edad, con Cédula de Identidad 
            N° {{ci_testador}}, quien me hace entrega de un pliego cerrado manifestando 
            que contiene su última voluntad.</p>
            
            <h3>DISPOSICIONES:</h3>
            <p><em>[El contenido específico del testamento permanece reservado en el pliego cerrado]</em></p>
            
            <p>El testador declara:</p>
            <ul>
              <li>Que se encuentra en pleno uso de sus facultades mentales</li>
              <li>Que el documento contiene su última voluntad</li>
              <li>Que está escrito en {{idioma}} y firmado por él</li>
              <li>Que {{numero_hojas}} hojas que lo componen están numeradas y selladas</li>
            </ul>
            
            <h3>TESTIGOS:</h3>
            <p>Actúan como testigos:</p>
            <p>1. {{nombre_testigo_1}}, CI: {{ci_testigo_1}}</p>
            <p>2. {{nombre_testigo_2}}, CI: {{ci_testigo_2}}</p>
            <p>3. {{nombre_testigo_3}}, CI: {{ci_testigo_3}}</p>
            
            <p>En fe de lo cual, firmamos el presente acta de protocolización.</p>
            
            <div style="margin-top: 50px;">
              <p>_________________________</p>
              <p>{{nombre_testador}}</p>
              <p>TESTADOR</p>
            </div>
            
            <div style="margin-top: 30px;">
              <p>_____________&nbsp;&nbsp;&nbsp;_____________&nbsp;&nbsp;&nbsp;_____________</p>
              <p>TESTIGOS</p>
            </div>
            
            <div style="margin-top: 30px;">
              <p>_________________________</p>
              <p>{{nombre_notario}}</p>
              <p>NOTARIO DE FE PÚBLICA</p>
            </div>
          </div>
        `,
        estaActiva: true,
        userCreateId: adminUserId,
      },

      // Plantilla para Acta de Asamblea
      {
        tipoDocumentoId: tiposDocumento[4].id,
        nombrePlantilla: 'Acta de Asamblea General Ordinaria',
        descripcion: 'Plantilla para actas de asambleas de sociedades',
        contenidoHtml: `
          <div class="documento-legal">
            <h1 style="text-align: center;">ACTA DE ASAMBLEA GENERAL ORDINARIA</h1>
            <h2 style="text-align: center;">{{razon_social}}</h2>
            
            <p>En la ciudad de {{ciudad}}, siendo las {{hora}} horas del día {{dia}} de {{mes}} 
            de {{anio}}, en el domicilio social ubicado en {{direccion_social}}, 
            se reunieron los socios de {{razon_social}}, con el fin de llevar a cabo 
            la Asamblea General Ordinaria, con el siguiente:</p>
            
            <h3>ORDEN DEL DÍA:</h3>
            <ol>
              <li>{{punto_1}}</li>
              <li>{{punto_2}}</li>
              <li>{{punto_3}}</li>
              <li>{{puntos_adicionales}}</li>
            </ol>
            
            <h3>SOCIOS PRESENTES:</h3>
            {{lista_socios_presentes}}
            
            <h3>QUÓRUM:</h3>
            <p>Se verifica la presencia de socios que representan {{porcentaje_quorum}}% 
            del capital social, por lo que existe quórum para sesionar válidamente.</p>
            
            <h3>RESOLUCIONES:</h3>
            {{resoluciones_detalle}}
            
            <p>No habiendo más asuntos que tratar, se da por finalizada la asamblea 
            siendo las {{hora_fin}} horas del mismo día.</p>
            
            <div style="margin-top: 50px;">
              <p>_________________________&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_________________________</p>
              <p>PRESIDENTE&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;SECRETARIO</p>
            </div>
          </div>
        `,
        estaActiva: true,
        userCreateId: adminUserId,
      },

      // Plantilla para Contrato de Arrendamiento
      {
        tipoDocumentoId: tiposDocumento[2].id,
        nombrePlantilla: 'Contrato de Arrendamiento',
        descripcion: 'Plantilla para contratos de alquiler de inmuebles',
        contenidoHtml: `
          <div class="documento-legal">
            <h1 style="text-align: center;">CONTRATO DE ARRENDAMIENTO</h1>
            
            <p>Conste por el presente contrato de arrendamiento, que celebran:</p>
            
            <h3>ARRENDADOR:</h3>
            <p>{{nombre_arrendador}}, CI: {{ci_arrendador}}, domiciliado en {{domicilio_arrendador}}</p>
            
            <h3>ARRENDATARIO:</h3>
            <p>{{nombre_arrendatario}}, CI: {{ci_arrendatario}}, domiciliado en {{domicilio_arrendatario}}</p>
            
            <h3>OBJETO:</h3>
            <p>El ARRENDADOR da en alquiler al ARRENDATARIO el inmueble ubicado en 
            {{direccion_inmueble}}, con una superficie de {{superficie}} m².</p>
            
            <h3>PLAZO:</h3>
            <p>El presente contrato tendrá una vigencia de {{plazo_meses}} meses, 
            iniciando el {{fecha_inicio}} y finalizando el {{fecha_fin}}.</p>
            
            <h3>PRECIO:</h3>
            <p>El precio del alquiler es de Bs. {{monto_alquiler}} mensuales, 
            pagaderos los primeros {{dia_pago}} días de cada mes.</p>
            
            <h3>GARANTÍA:</h3>
            <p>El ARRENDATARIO entrega en este acto la suma de Bs. {{monto_garantia}} 
            en concepto de garantía.</p>
            
            <h3>OBLIGACIONES:</h3>
            <ul>
              <li>{{obligacion_1}}</li>
              <li>{{obligacion_2}}</li>
              <li>{{obligacion_3}}</li>
            </ul>
            
            <p>En señal de conformidad, las partes firman en {{ciudad}}, 
            a los {{dia}} días de {{mes}} de {{anio}}.</p>
            
            <div style="margin-top: 50px;">
              <p>_________________________&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_________________________</p>
              <p>ARRENDADOR&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ARRENDATARIO</p>
            </div>
          </div>
        `,
        estaActiva: true,
        userCreateId: adminUserId,
      },
    ],
  });

  console.info('Created 6 plantillas de documento');
}

export async function crearTransaccionesEgresos(
  prisma: PrismaClient,
  gastos: any[],
  cuentasBancarias: any,
) {
  // Obtener los gastos del array
  const gastoArray = Array.isArray(gastos) ? gastos : Object.values(gastos);

  await prisma.transaccionesEgresos.createMany({
    data: [
      // Transacciones para el primer gasto (servicios públicos)
      {
        gastoId: gastoArray[0].id,
        monto: 800.0,
        fecha: new Date('2025-12-05T10:00:00Z'),
        cuentaBancariaId: null, // Efectivo
        metodoPago: 1, // EFECTIVO
      },
      {
        gastoId: gastoArray[0].id,
        monto: 500.0,
        fecha: new Date('2025-12-20T11:30:00Z'),
        cuentaBancariaId: cuentasBancarias[0].id,
        metodoPago: 3, // TRANSFERENCIA
      },

      // Transacciones para el segundo gasto (papelería)
      {
        gastoId: gastoArray[1].id,
        monto: 350.0,
        fecha: new Date('2025-12-10T14:00:00Z'),
        cuentaBancariaId: null,
        metodoPago: 1, // EFECTIVO
      },

      // Transacciones para el tercer gasto (mantenimiento)
      {
        gastoId: gastoArray[2].id,
        monto: 1500.0,
        fecha: new Date('2025-12-08T09:00:00Z'),
        cuentaBancariaId: cuentasBancarias[1].id,
        metodoPago: 3, // TRANSFERENCIA
      },
      {
        gastoId: gastoArray[2].id,
        monto: 1000.0,
        fecha: new Date('2025-12-22T10:00:00Z'),
        cuentaBancariaId: null,
        metodoPago: 1, // EFECTIVO
      },

      // Transacciones para el cuarto gasto (publicidad)
      {
        gastoId: gastoArray[3].id,
        monto: 2500.0,
        fecha: new Date('2025-12-15T15:30:00Z'),
        cuentaBancariaId: cuentasBancarias[0].id,
        metodoPago: 3, // TRANSFERENCIA
      },

      // Transacciones para el quinto gasto (capacitación)
      {
        gastoId: gastoArray[4].id,
        monto: 800.0,
        fecha: new Date('2026-01-03T11:00:00Z'),
        cuentaBancariaId: null,
        metodoPago: 1, // EFECTIVO
      },
      {
        gastoId: gastoArray[4].id,
        monto: 1000.0,
        fecha: new Date('2026-01-05T14:00:00Z'),
        cuentaBancariaId: cuentasBancarias[1].id,
        metodoPago: 2, // QR
      },
    ],
  });

  console.info('Created 8 transacciones de egresos');
}

export async function crearArqueosDiarios(prisma: PrismaClient, adminUserId: string) {
  await prisma.arqueosDiarios.createMany({
    data: [
      // Arqueo de diciembre 2025
      {
        fecha: new Date('2025-12-05'),
        usuarioCierreId: adminUserId,
        totalIngresosEfectivo: 2500.0,
        totalIngresosBancos: 3500.0,
        totalEgresosEfectivo: 800.0,
        totalEgresosBancos: 500.0,
        saldoFinalDia: 4700.0,
        observaciones: 'Día normal de operaciones. Se registraron 3 servicios nuevos.',
        fechaCierre: new Date('2025-12-05T18:00:00Z'),
      },
      {
        fecha: new Date('2025-12-10'),
        usuarioCierreId: adminUserId,
        totalIngresosEfectivo: 1800.0,
        totalIngresosBancos: 2200.0,
        totalEgresosEfectivo: 350.0,
        totalEgresosBancos: 0.0,
        saldoFinalDia: 3650.0,
        observaciones: 'Compra de papelería y útiles de oficina pagada en efectivo.',
        fechaCierre: new Date('2025-12-10T18:30:00Z'),
      },
      {
        fecha: new Date('2025-12-15'),
        usuarioCierreId: adminUserId,
        totalIngresosEfectivo: 3200.0,
        totalIngresosBancos: 4800.0,
        totalEgresosEfectivo: 0.0,
        totalEgresosBancos: 2500.0,
        saldoFinalDia: 5500.0,
        observaciones:
          'Alto volumen de ingresos. Pago de publicidad digital por transferencia bancaria.',
        fechaCierre: new Date('2025-12-15T19:00:00Z'),
      },
      {
        fecha: new Date('2025-12-20'),
        usuarioCierreId: adminUserId,
        totalIngresosEfectivo: 2100.0,
        totalIngresosBancos: 1900.0,
        totalEgresosEfectivo: 0.0,
        totalEgresosBancos: 500.0,
        saldoFinalDia: 3500.0,
        observaciones: 'Pago parcial de servicios públicos por transferencia.',
        fechaCierre: new Date('2025-12-20T17:45:00Z'),
      },
      {
        fecha: new Date('2025-12-22'),
        usuarioCierreId: adminUserId,
        totalIngresosEfectivo: 1500.0,
        totalIngresosBancos: 2500.0,
        totalEgresosEfectivo: 1000.0,
        totalEgresosBancos: 0.0,
        saldoFinalDia: 3000.0,
        observaciones: 'Pago al técnico de mantenimiento en efectivo.',
        fechaCierre: new Date('2025-12-22T18:15:00Z'),
      },

      // Arqueos de enero 2026
      {
        fecha: new Date('2026-01-02'),
        usuarioCierreId: adminUserId,
        totalIngresosEfectivo: 2800.0,
        totalIngresosBancos: 3200.0,
        totalEgresosEfectivo: 0.0,
        totalEgresosBancos: 0.0,
        saldoFinalDia: 6000.0,
        observaciones: 'Primer día laboral del año. Excelente inicio de operaciones.',
        fechaCierre: new Date('2026-01-02T18:00:00Z'),
      },
      {
        fecha: new Date('2026-01-03'),
        usuarioCierreId: adminUserId,
        totalIngresosEfectivo: 1900.0,
        totalIngresosBancos: 2600.0,
        totalEgresosEfectivo: 800.0,
        totalEgresosBancos: 0.0,
        saldoFinalDia: 3700.0,
        observaciones: 'Pago de inscripción para capacitación del personal.',
        fechaCierre: new Date('2026-01-03T18:30:00Z'),
      },
      {
        fecha: new Date('2026-01-04'),
        usuarioCierreId: adminUserId,
        totalIngresosEfectivo: 2200.0,
        totalIngresosBancos: 1800.0,
        totalEgresosEfectivo: 0.0,
        totalEgresosBancos: 0.0,
        saldoFinalDia: 4000.0,
        observaciones: 'Operaciones normales del sábado.',
        fechaCierre: new Date('2026-01-04T13:00:00Z'),
      },
      {
        fecha: new Date('2026-01-05'),
        usuarioCierreId: adminUserId,
        totalIngresosEfectivo: 3100.0,
        totalIngresosBancos: 2900.0,
        totalEgresosEfectivo: 0.0,
        totalEgresosBancos: 1000.0,
        saldoFinalDia: 5000.0,
        observaciones: 'Pago de segunda cuota de capacitación por QR.',
        fechaCierre: new Date('2026-01-05T18:00:00Z'),
      },
      {
        fecha: new Date('2026-01-06'),
        usuarioCierreId: null, // Arqueo aún no cerrado
        totalIngresosEfectivo: 1200.0,
        totalIngresosBancos: 800.0,
        totalEgresosEfectivo: 0.0,
        totalEgresosBancos: 0.0,
        saldoFinalDia: 2000.0,
        observaciones: 'Arqueo del día en curso - pendiente de cierre.',
        fechaCierre: new Date('2026-01-06T09:00:00Z'),
      },
    ],
  });

  console.info('Created 10 arqueos diarios');
}
