import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Solution } from '../../solutions/entities/solution.entity';
import { Thematic } from '../../thematics/entities/thematic.entity';

@Entity()
export class Call {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  name: string;

  @Column()
  started_at: Date;

  @Column()
  ended_at: Date;

  @Column({ type: 'text' })
  description: string;

  @CreateDateColumn({ type: 'datetime' })
  created_at?: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updated_at?: Date;

  @OneToMany(() => Solution, (solution) => solution.call)
  solutions: Solution[];

  @ManyToMany(() => Thematic, (thematic) => thematic.calls)
  @JoinTable()
  thematics: Thematic[];
}

