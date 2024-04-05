import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Solution } from '../../solutions/entities/solution.entity';


@Entity()
export class Feedback {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  adminComment?: string;

  @Column({ nullable: true })
  userComment?: string;

  @Column({ nullable: true, default: () => 'now()' })
  createdAt?: Date;

  @Column({ nullable: true, onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt?: Date;

  @Column()
  quotations: string;

  @ManyToOne(() => Solution, (solution) => solution.feedbacks, { onDelete: 'SET NULL' })
  solution?: Solution;

  @OneToMany(() => Solution, (solution) => solution.feedbacks)
  solutions: Solution[];

  @ManyToOne(() => User, (user) => user.feedbacks, { onDelete: 'SET NULL' })
  user?: User;

  @Column({ nullable: true })
  userId?: number;
}