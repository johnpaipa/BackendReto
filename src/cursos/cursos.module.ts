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
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Curso, Progreso, Capitulo, Modulo, Clase, Insignia, User]), CloudinaryModule],
  controllers: [CursosController],
  providers: [CursosService , CloudinaryService],
})
export class CursosModule {}
