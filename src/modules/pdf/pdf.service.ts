import { Injectable } from '@nestjs/common';
import { rejects } from 'node:assert';
import { join } from 'node:path';
import PdfInstance from 'pdfmake';

const fonts = {
  Roboto: {
    normal: join(__dirname, '../../resources/fonts/Roboto/Roboto-Regular.ttf'),
    bold: join(__dirname, '../../resources/fonts/Roboto/Roboto-Medium.ttf'),
    italics: join(__dirname, '../../resources/fonts/Roboto/Roboto-Italic.ttf'),
    bolditalics: join(__dirname, '../../resources/fonts/Roboto/Roboto-MediumItalic.ttf'),
  },
};

@Injectable()
export class PdfService {
  private readonly pdfMake: typeof PdfInstance;
  constructor() {
    this.pdfMake = PdfInstance;
    this.pdfMake.addFonts(fonts);
  }

  generarPdf(docDefinition): Promise<Buffer> {
    return new Promise((resolve) => {
      this.pdfMake
        .createPdf(docDefinition)
        .getBuffer()
        .then(
          (binary) => {
            resolve(binary);
          },
          (err) => {
            console.error(err);
          },
        );
    });
  }
}
