import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { User } from '../../users/entities/user.entity';

@Entity()
export class Organisation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true, default: () => 'now()' })
  createdAt?: Date;

  @Column({ nullable: true, onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt?: Date;

  @OneToMany(() => User, (user) => user.organisation)
  users: User[];
}