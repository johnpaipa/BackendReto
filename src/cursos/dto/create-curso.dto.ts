import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateCursoDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsNotEmpty()
  @IsString()
  descripcion: string;

  @IsNotEmpty()
  @IsNumber()
  moduloId: number; 
}
