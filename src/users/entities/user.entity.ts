import {
  BeforeInsert,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Solution } from '../../solutions/entities/solution.entity';
import { Feedback } from '../../feedbacks/entities/feedback.entity';
import { Pole } from '../../poles/entities/pole.entity';
import { Organisation } from '../../organisations/entities/organisation.entity';
import { Role } from '../../roles/entities/role.entity';
import * as bcrypt from 'bcrypt';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  password?: string;

  @Column({ nullable: true })
  phoneNumber?: string;

  @Column({ nullable: true })
  address?: string;

  @Column({ nullable: true })
  token?: string;

  @Column({ nullable: true })
  googleImage?: string;

  @Column({ nullable: true })
  profile?: string;

  @Column({ nullable: true, default: () => 'now()' })
  createdAt?: Date;

  @Column({ nullable: true, onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt?: Date;

  @OneToMany(() => Solution, (solution) => solution.user)
  solutions: Solution[];

  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable({ name: 'RoleToUser' })
  roles: Role[];

  @OneToMany(() => Feedback, (feedback) => feedback.user)
  feedbacks: Feedback[];

  @OneToOne(() => Pole, (pole) => pole.user)
  pole?: Pole;

  @Column({ nullable: true })
  poleId?: number;

  @OneToOne(() => Organisation, (organisation) => organisation.users)
  organisation?: Organisation;

  @Column({ nullable: true })
  organisationId?: number;

  @BeforeInsert()
  async hashPassword(): Promise<void> {
    this.password = await bcrypt.hash(this.password, 10);
  }
}