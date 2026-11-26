import { PartialType } from '@nestjs/swagger';
import { CreateComponentDto } from './create-component.dto';

/** Todos os campos são opcionais: só o que for enviado é alterado. */
export class UpdateComponentDto extends PartialType(CreateComponentDto) {}
