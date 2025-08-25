import { IsNotEmpty, IsString, IsNumber, IsUrl } from 'class-validator';

export class CreateClaseDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsNotEmpty()
  @IsString()
  tipo: string;

  @IsNotEmpty()
  @IsUrl()
  url_recurso: string;

  @IsNotEmpty()
  @IsNumber()
  capituloId: number;
}
