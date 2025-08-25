import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateProgresoDto {
  @IsNotEmpty()
  @IsNumber()
  cursoId: number;

  @IsNotEmpty()
  @IsNumber()
  usuarioId: number;

  @IsNotEmpty()
  @IsString()
  estado: string;
}
