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
import { Call } from '../../calls/entities/call.entity';
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

  @ManyToMany(() => Call, (call) => call.thematics)
  calls: Call[];

  @ManyToMany(() => Challenge, (challenge) => challenge.thematics)
  @JoinTable()
  challenges: Challenge[];
}
