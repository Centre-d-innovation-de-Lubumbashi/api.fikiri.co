import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { Solution } from '../../solutions/entities/solution.entity';
import { Event } from '../../events/entities/event.entity';
import { Challenge } from '../../challenges/entities/challenge.entity';

@Entity()
export class Thematic {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  name: string;

  @Column()
  odds: string;

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updated_at: Date;

  @OneToMany(() => Solution, (solution) => solution.thematic)
  solutions: Solution[];

  @ManyToMany(() => Event, (call) => call.thematics)
  calls: Event[];

  @ManyToMany(() => Challenge, (challenge) => challenge.thematics)
  @JoinTable()
  challenges: Challenge[];
}
