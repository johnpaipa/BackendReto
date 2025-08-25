import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Capitulo } from "./capitulo.entity";

@Entity()
export class Clase {


  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Capitulo, (capitulo) => capitulo.clases, { cascade: true })
  capitulo: Capitulo;

  @Column()
  tipo: string;

  @Column()
  url_recurso: string;

  @Column()
  nombre: string;

}
