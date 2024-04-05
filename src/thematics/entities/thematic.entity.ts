import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToMany } from "typeorm";
import { Solution } from '../../solutions/entities/solution.entity';
import { Call } from '../../calls/entities/call.entity';
import { Challenge } from '../../challenges/entities/challenge.entity';

@Entity()
export class Thematic {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "text" })
  name: string;

  @Column()
  odds: string;

  @Column({ nullable: true, default: () => 'now()' })
  createdAt?: Date;

  @Column({ nullable: true, onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt?: Date;

  @OneToMany(() => Solution, (solution) => solution.thematic)
  solutions: Solution[];

  @ManyToMany(() => Call, (call) => call.thematics)
  @JoinTable({ name: "CallToThematic" })
  calls: Call[];

  @OneToMany(() => Challenge, (challenge) => challenge.thematics)
  challenges: Challenge[];
}