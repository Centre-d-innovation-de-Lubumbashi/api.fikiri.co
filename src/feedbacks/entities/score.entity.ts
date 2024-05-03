import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Feedback } from './feedback.entity';

@Entity()
export class Score {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  question: string;

  @Column({ type: 'float' })
  score: number;

  @ManyToOne(() => Feedback, (feedback) => feedback.scores)
  @JoinColumn()
  feedback: Feedback;
}
