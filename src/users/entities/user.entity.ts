import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
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
  phone_number?: string;

  @Column({ nullable: true })
  address?: string;

  @Column({ nullable: true })
  token?: string;

  @Column({ nullable: true })
  google_image?: string;

  @Column({ nullable: true })
  profile?: string;

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updated_at: Date;

  @OneToMany(() => Solution, (solution) => solution.user)
  solutions: Solution[];

  @ManyToMany(() => Role, (role) => role.users,
    { onDelete: 'CASCADE', onUpdate: 'CASCADE' },
  )
  @JoinTable()
  roles: Role[];

  @OneToMany(() => Feedback, (feedback) => feedback.user,
    { onDelete: 'CASCADE', onUpdate: 'CASCADE' },
  )
  feedbacks: Feedback[];

  @ManyToOne(() => Pole, (pole) => pole.users)
  @JoinColumn()
  pole: Pole;

  @ManyToOne(() => Organisation, (organisation) => organisation.users)
  @JoinColumn()
  organisation: Organisation;

  @BeforeInsert()
  async hashPassword(): Promise<void> {
    this.password = await bcrypt.hash(this.password, 10);
  }
}