import { Injectable } from '@nestjs/common';
import { join } from 'node:path';
import PdfMake from 'pdfmake/build/pdfmake';
import { TDocumentDefinitions } from 'pdfmake/interfaces';

const fonts = {
  Roboto: {
    normal: join(__dirname, '../..', 'resources/fonts/Roboto/Roboto-Regular.ttf'),
    bold: join(__dirname, '../..', 'resources/fonts/Roboto/Roboto-Medium.ttf'),
    italics: join(__dirname, '../..', 'resources/fonts/Roboto/Roboto-Italic.ttf'),
    bolditalics: join(__dirname, '../..', 'resources/fonts/Roboto/Roboto-MediumItalic.ttf'),
  },
};

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
(PdfMake as any).addFonts(fonts);

@Injectable()
export class PdfService {
  constructor() {}

  async generarPdf(docDefinition: TDocumentDefinitions): Promise<Buffer> {
    const buffer: Buffer = await new Promise((resolve) => {
      PdfMake.createPdf(docDefinition).getBuffer((b: Buffer) => resolve(b));
    });
    return buffer;
  }
}
