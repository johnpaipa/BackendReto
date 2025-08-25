import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Clase } from "./clase.entity";
import { Curso } from "./curso.entity";
@Entity()
export class Capitulo {


  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => Clase, (clase) => clase.capitulo)
  clases: Clase[];

  @ManyToOne(() => Curso, (curso) => curso.capitulos)
  curso: Curso;

  @Column()
  nombre: string;

  @Column()
  orden: number;
  @Column({ nullable: true })
  descripcion: string;

}
