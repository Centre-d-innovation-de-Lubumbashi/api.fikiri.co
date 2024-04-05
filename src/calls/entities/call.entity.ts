import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Solution } from '../../solutions/entities/solution.entity';
import { Thematic } from '../../thematics/entities/thematic.entity';

@Entity()
export class Call {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  name: string;

  @Column()
  startedAt: Date;

  @Column()
  endedAt: Date;

  @Column({ type: 'text' })
  description: string;

  @Column({ nullable: true, default: () => 'now()' })
  createdAt?: Date;

  @Column({ nullable: true, onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt?: Date;

  @OneToMany(() => Solution, (solution) => solution.call)
  solutions: Solution[];

  @ManyToMany(() => Thematic, (thematic) => thematic.calls)
  @JoinTable({ name: 'CallToThematic' })
  thematics: Thematic[];
}