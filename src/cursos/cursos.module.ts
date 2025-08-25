import { Module } from '@nestjs/common';
import { CursosService } from './cursos.service';
import { CursosController } from './cursos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Curso } from './entities/curso.entity';
import { Progreso } from './entities/progreso.entity';
import { Capitulo } from './entities/capitulo.entity';
import { Modulo } from './entities/modulo.entity';
import { Clase } from './entities/clase.entity';
import { Insignia } from './entities/insignia.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Curso, Progreso, Capitulo, Modulo, Clase, Insignia])],
  controllers: [CursosController],
  providers: [CursosService],
})
export class CursosModule {}
