import { createObjectCsvWriter } from 'csv-writer';
import { Response } from 'express';
import * as fs from 'node:fs';
import * as path from 'node:path';

export class ReportExportHelper {
  /**
   * Genera un PDF a partir de datos de reporte
   */
  static async generatePDF(
    res: Response,
    titulo: string,
    resumen: Record<string, any>,
    datos: any[],
    fileName: string,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const PDFDocument = require('pdfkit');
        const doc = new PDFDocument({ margin: 50, size: 'A4' });

        // Configurar headers para descarga
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

        // Pipe el PDF al response
        doc.pipe(res);

        // Colores corporativos
        const primaryColor = '#2563eb'; // Azul
        const secondaryColor = '#64748b'; // Gris
        const accentColor = '#f97316'; // Naranja

        // ============ HEADER CON LOGO ============
        const logoPath = path.join(process.cwd(), 'public', 'images', 'logo.jpg');

        // Verificar si existe el logo
        if (fs.existsSync(logoPath)) {
          try {
            // Logo en la esquina superior izquierda
            doc.image(logoPath, 50, 45, { width: 80, height: 80 });
          } catch (error) {
            console.warn('No se pudo cargar el logo:', error);
          }
        }

        // Información de la empresa al lado del logo
        doc
          .fontSize(18)
          .font('Helvetica-Bold')
          .fillColor(primaryColor)
          .text('PetStore', 150, 50, { align: 'left' });

        doc
          .fontSize(9)
          .font('Helvetica')
          .fillColor(secondaryColor)
          .text('Sistema de Gestión Comercial', 150, 72, { align: 'left' });

        doc.fontSize(8).text('www.petstore.com | info@petstore.com', 150, 86, { align: 'left' });

        // Línea divisoria
        doc
          .strokeColor(primaryColor)
          .lineWidth(2)
          .moveTo(50, 140)
          .lineTo(doc.page.width - 50, 140)
          .stroke();

        doc.moveDown(3);

        // ============ TÍTULO DEL REPORTE ============
        doc
          .fontSize(22)
          .font('Helvetica-Bold')
          .fillColor('#1e293b')
          .text(titulo, 50, 160, { align: 'center' });

        // Fecha de generación con estilo
        const fechaGeneracion = new Date().toLocaleString('es-ES', {
          dateStyle: 'full',
          timeStyle: 'short',
        });

        doc
          .fontSize(10)
          .font('Helvetica')
          .fillColor(secondaryColor)
          .text(`Generado el: ${fechaGeneracion}`, 50, 190, { align: 'center' });

        doc.moveDown(3);

        // ============ RESUMEN CON DISEÑO MEJORADO ============
        const startY = doc.y + 20;

        // Fondo para el resumen
        doc
          .roundedRect(50, startY - 10, doc.page.width - 100, 40, 5)
          .fillAndStroke('#f1f5f9', primaryColor);

        doc
          .fontSize(16)
          .font('Helvetica-Bold')
          .fillColor(primaryColor)
          .text('Resumen Ejecutivo', 60, startY, { continued: false });

        doc.moveDown(1.5);

        // Resumen en dos columnas
        const resumenKeys = Object.keys(resumen);
        const midPoint = Math.ceil(resumenKeys.length / 2);
        const leftColumn = resumenKeys.slice(0, midPoint);
        const rightColumn = resumenKeys.slice(midPoint);

        let currentY = doc.y;

        // Columna izquierda
        leftColumn.forEach((key) => {
          const label = this.formatLabel(key);
          const formattedValue = this.formatValue(resumen[key]);

          doc
            .fontSize(11)
            .font('Helvetica-Bold')
            .fillColor('#334155')
            .text(`${label}:`, 60, currentY, { continued: true });

          doc
            .font('Helvetica')
            .fillColor(accentColor)
            .text(` ${formattedValue}`, { align: 'left' });

          currentY += 20;
        });

        // Columna derecha
        currentY = doc.y - leftColumn.length * 20;
        rightColumn.forEach((key) => {
          const label = this.formatLabel(key);
          const formattedValue = this.formatValue(resumen[key]);

          doc
            .fontSize(11)
            .font('Helvetica-Bold')
            .fillColor('#334155')
            .text(`${label}:`, 320, currentY, { continued: true });

          doc
            .font('Helvetica')
            .fillColor(accentColor)
            .text(` ${formattedValue}`, { align: 'left' });

          currentY += 20;
        });

        doc.y = Math.max(doc.y, currentY);
        doc.moveDown(2);

        // ============ DATOS DETALLADOS ============
        if (datos && datos.length > 0) {
          // Línea divisoria
          doc
            .strokeColor('#cbd5e1')
            .lineWidth(1)
            .moveTo(50, doc.y)
            .lineTo(doc.page.width - 50, doc.y)
            .stroke();

          doc.moveDown();

          // Fondo para título de datos
          const detailsY = doc.y;
          doc
            .roundedRect(50, detailsY - 5, doc.page.width - 100, 30, 5)
            .fillAndStroke('#e0f2fe', '#0284c7');

          doc
            .fontSize(14)
            .font('Helvetica-Bold')
            .fillColor('#0369a1')
            .text('Detalle de Registros', 60, detailsY);

          doc.moveDown();

          doc
            .fontSize(10)
            .font('Helvetica')
            .fillColor(secondaryColor)
            .text(`Total de registros encontrados: ${datos.length}`, 60, doc.y);

          doc.moveDown(0.5);

          // Nota informativa
          doc
            .fontSize(9)
            .font('Helvetica-Oblique')
            .fillColor('#64748b')
            .text(
              '💡 Para ver el detalle completo de los datos, exporte el reporte en formato Excel.',
              60,
              doc.y,
            );
        }

        // ============ PIE DE PÁGINA MEJORADO ============
        const pageHeight = doc.page.height;
        const footerY = pageHeight - 80;

        // Obtener el número total de páginas antes de añadir footers
        const range = doc.bufferedPageRange();
        const pageCount = range.count;

        // Iterar por cada página para agregar el footer
        for (let i = 0; i < pageCount; i++) {
          doc.switchToPage(i);

          // Línea superior del footer
          doc
            .strokeColor(primaryColor)
            .lineWidth(1)
            .moveTo(50, footerY)
            .lineTo(doc.page.width - 50, footerY)
            .stroke();

          // Información del footer
          doc
            .fontSize(9)
            .font('Helvetica-Bold')
            .fillColor('#1e293b')
            .text('PetStore - Sistema de Gestión', 50, footerY + 15, {
              align: 'center',
              width: doc.page.width - 100,
            });

          doc
            .fontSize(8)
            .font('Helvetica')
            .fillColor(secondaryColor)
            .text(
              'Este documento es confidencial y de uso exclusivo para fines internos',
              50,
              footerY + 30,
              {
                align: 'center',
                width: doc.page.width - 100,
              },
            );

          // Número de página
          doc
            .fontSize(8)
            .fillColor(secondaryColor)
            .text(`Página ${i + 1} de ${pageCount}`, 50, footerY + 45, {
              align: 'center',
              width: doc.page.width - 100,
            });
        }

        doc.end();

        doc.on('finish', () => resolve());
        doc.on('error', (err) => reject(new Error(err.message)));
      } catch (error) {
        reject(error instanceof Error ? error : new Error(String(error)));
      }
    });
  }

  /**
   * Genera un CSV a partir de datos de reporte
   */
  static async generateCSV(
    res: Response,
    datos: any[],
    fileName: string,
    headers: Array<{ id: string; title: string }>,
  ): Promise<void> {
    try {
      const tempDir = path.join(process.cwd(), 'storage', 'temp');
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }

      const filePath = path.join(tempDir, fileName);

      const csvWriter = createObjectCsvWriter({
        path: filePath,
        header: headers,
      });

      await csvWriter.writeRecords(datos);

      // Configurar headers para descarga
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

      // Enviar el archivo
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);

      await new Promise<void>((resolve, reject) => {
        fileStream.on('end', () => {
          // Eliminar archivo temporal
          fs.unlinkSync(filePath);
          resolve();
        });

        fileStream.on('error', (err) => {
          reject(new Error(err.message));
        });
      });
    } catch (error) {
      throw error instanceof Error ? error : new Error(String(error));
    }
  }

  /**
   * Formatea etiquetas para el PDF
   */
  private static formatLabel(key: string): string {
    const labels: Record<string, string> = {
      totalVentas: 'Total de Ventas',
      totalPedidos: 'Total de Pedidos',
      promedioPorPedido: 'Promedio por Pedido',
      totalProductos: 'Total de Productos',
      productosBajoStock: 'Productos Bajo Stock',
      valorTotalInventario: 'Valor Total del Inventario',
      totalUsuarios: 'Total de Usuarios',
      clientesActivos: 'Clientes Activos',
      productosActivos: 'Productos Activos',
      productosMasVendidos: 'Top Productos Vendidos',
      pedidosPorEstado: 'Pedidos por Estado',
      totalIngresos: 'Total de Ingresos',
      totalEntregas: 'Total de Entregas',
      entregasPorEstado: 'Entregas por Estado',
    };

    return labels[key] || key;
  }

  /**
   * Formatea valores para el PDF
   */
  private static formatValue(value: any): string {
    if (typeof value === 'number') {
      return value.toLocaleString('es-ES', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }

    if (typeof value === 'object' && value !== null) {
      if (value.fechaInicio || value.fechaFin) {
        return `${value.fechaInicio || 'Inicio'} - ${value.fechaFin || 'Fin'}`;
      }
      return JSON.stringify(value, null, 2);
    }

    return String(value);
  }

  /**
   * Aplana objeto para CSV
   */
  static flattenObject(obj: any, prefix = ''): any {
    const flattened: any = {};

    for (const key of Object.keys(obj)) {
      const value = obj[key];
      const newKey = prefix ? `${prefix}_${key}` : key;

      if (value && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
        Object.assign(flattened, this.flattenObject(value, newKey));
      } else if (Array.isArray(value)) {
        flattened[newKey] = value.length;
      } else if (value instanceof Date) {
        flattened[newKey] = value.toISOString();
      } else {
        flattened[newKey] = value;
      }
    }

    return flattened;
  }
}
