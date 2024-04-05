import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Solution } from '../../solutions/entities/solution.entity';

@Entity()
export class Status {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true, default: () => 'now()' })
  createdAt?: Date;

  @Column({ nullable: true, onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt?: Date;

  @OneToMany(() => Solution, (solution) => solution.status)
  solutions: Solution[];
}