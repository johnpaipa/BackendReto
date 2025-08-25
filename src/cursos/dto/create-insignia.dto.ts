import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateInsigniaDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsNotEmpty()
  @IsString()
  descripcion: string;

  @IsNotEmpty()
  @IsNumber()
  cursoId: number; 
}
