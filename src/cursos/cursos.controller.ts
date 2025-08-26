import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, UseGuards, ParseIntPipe } from '@nestjs/common';
import { CursosService } from './cursos.service';
import { CreateCursoDto } from './dto/create-curso.dto';
import { UpdateCursoDto } from './dto/update-curso.dto';
import { CreateModuloDto } from './dto/create-modulo.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateCapituloDto } from './dto/create-capitulo.dto';
import { CreateInsigniaDto } from './dto/create-insignia.dto';
import { AuthGuard } from '@nestjs/passport';
import { CreateProgresoDto } from './dto/create-progreso.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('cursos')
export class CursosController {
  constructor(
    private readonly cursosService: CursosService,
    private readonly cloudinaryService: CloudinaryService,
  ) { }

  @Post('/clases/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadClase(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { nombre: string; tipo: string; capituloId: number },
  ) {
    const result = await this.cloudinaryService.uploadFile(file);
    const nuevaClase = {
      nombre: body.nombre,
      tipo: body.tipo,
      url_recurso: result.secure_url,
      capituloId: Number(body.capituloId),
    };
    return this.cursosService.createClase(nuevaClase);
  }

  @Post()
  create(@Body() createCursoDto: CreateCursoDto) {
    return this.cursosService.create(createCursoDto);
  }

  @Get()
  findAll() {
    return this.cursosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cursosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCursoDto: UpdateCursoDto) {
    return this.cursosService.update(+id, updateCursoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cursosService.remove(+id);
  }

  @Post('/modulo')
  createModulo(@Body() createModuloDto: CreateModuloDto) {
    return this.cursosService.createModulo(createModuloDto);
  }

  @Post('/capitulo')
  createCapitulo(@Body() createCapituloDto: CreateCapituloDto) {
    return this.cursosService.createCapitulo(createCapituloDto);
  }

  @Post('/insignia')
  createInsignia(@Body() createInsigniaDto: CreateInsigniaDto) {
    return this.cursosService.createInsignia(createInsigniaDto);
  }

  @Post(':cursoId/progreso')
  async createProgreso(
    @Body() createProgresoDto: CreateProgresoDto,
  ) {
    createProgresoDto.cursoId = Number(createProgresoDto.cursoId);
    return this.cursosService.createProgreso(createProgresoDto);
  }
}
