import { Controller, Post, Body } from '@nestjs/common';
import { ContactoService } from './contacto.service';
import { ContactoMensajeDto } from './dto/contacto.input.dto';
import { ApiDescription } from 'src/common/decorators/controller.decorator';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseMensajeType } from './dto/contacto.response';

@ApiTags('[public] Contacto')
@Controller('contacto')
export class ContactoController {
  constructor(private readonly contactoService: ContactoService) {}

  @Post('enviar-mensaje')
  @ApiDescription('Enviar mensaje de contacto', [])
  @ApiResponse({ status: 201, type: () => ResponseMensajeType })
  enviarMensaje(@Body() dto: ContactoMensajeDto) {
    return this.contactoService.enviarMensaje(dto);
  }
}
