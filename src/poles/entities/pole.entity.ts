import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Solution } from '../../solutions/entities/solution.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Pole {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true, default: () => 'now()' })
  createdAt?: Date;

  @Column({ nullable: true, onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt?: Date;

  @OneToMany(() => Solution, (solution) => solution.pole)
  solutions: Solution[];

  @ManyToOne(() => User, (user) => user.pole, { nullable: true })
  user?: User;
}