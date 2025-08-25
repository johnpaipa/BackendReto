import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateCapituloDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsNotEmpty()
  @IsString()
  descripcion: string;

  
  @IsNotEmpty()
  @IsNumber()
  cursoId: number;

  
  @IsOptional()
  @IsNumber()
  orden?: number;
}
