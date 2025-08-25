import { IsNotEmpty, IsString } from 'class-validator';

export class CreateModuloDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsNotEmpty()
  @IsString()
  descripcion: string;
}
