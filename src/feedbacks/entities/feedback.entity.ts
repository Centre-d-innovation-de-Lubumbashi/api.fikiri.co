import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Solution } from '../../solutions/entities/solution.entity';
import { Status } from 'src/status/entities/status.entity';

@Entity()
export class Feedback {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  comment: string;

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updated_at: Date;

  @Column({ type: 'varchar' })
  quotations: string;

  @ManyToMany(() => Solution, (solution) => solution.feedbacks)
  solutions: Solution[];

  @ManyToOne(() => User, (user) => user.feedbacks)
  @JoinColumn()
  user: User;

  @ManyToOne(() => Status, (status) => status.feedbacks)
  @JoinColumn()
  status: Status;
}
