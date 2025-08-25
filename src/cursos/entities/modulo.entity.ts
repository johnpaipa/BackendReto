import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Curso } from "./curso.entity";

@Entity()
export class Modulo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  descripcion: string;

  
  @OneToMany(() => Curso, (curso) => curso.modulo)
  cursos: Curso[];
}
