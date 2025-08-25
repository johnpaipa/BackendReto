import { PartialType } from '@nestjs/mapped-types';
import { CreateCapituloDto } from './create-capitulo.dto';

export class UpdateClaseDto extends PartialType(CreateCapituloDto) {}
