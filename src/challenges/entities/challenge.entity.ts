import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Solution } from '../../solutions/entities/solution.entity';
import { Thematic } from '../../thematics/entities/thematic.entity';

@Entity()
export class Challenge {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  name: string;

  @Column({ nullable: true, default: () => 'now()' })
  createdAt?: Date;

  @Column({ nullable: true, onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt?: Date;

  @ManyToMany(() => Solution, (solution) => solution.challenges)
  @JoinTable({ name: 'ChallengeToSolution' })
  solutions: Solution[];

  @ManyToMany(() => Thematic, (thematic) => thematic.challenges)
  @JoinTable({ name: 'ChallengeToThematic' })
  thematics: Thematic[];
}