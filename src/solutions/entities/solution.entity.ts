import { Thematic } from 'src/thematics/entities/thematic.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Challenge } from '../../challenges/entities/challenge.entity';
import { Status } from '../../status/entities/status.entity';
import { Feedback } from '../../feedbacks/entities/feedback.entity';
import { Pole } from '../../poles/entities/pole.entity';
import { Call } from '../../calls/entities/call.entity';
import { Image } from '../../images/entities/image.entity';

@Entity()
export class Solution {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  name: string;

  @Column({ nullable: true })
  imageLink?: string;

  @Column({ nullable: true })
  videoLink?: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  callId: number;

  @Column()
  thematicId: number;

  @Column({ type: 'text' })
  targetedProblem: string;

  @Column()
  statusId: number;

  @Column({ nullable: true, default: () => 'now()' })
  createdAt?: Date;

  @Column({ nullable: true, onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt?: Date;

  @Column({ nullable: true })
  userId?: number;

  @ManyToOne(() => Call, (call) => call.solutions)
  call: Call;

  @ManyToOne(() => Status, (status) => status.solutions)
  status: Status;

  @ManyToOne(() => Thematic, (thematic) => thematic.solutions)
  thematic: Thematic;

  @ManyToOne(() => User, (user) => user.solutions)
  user?: User;

  @ManyToMany(() => Challenge, (challenge) => challenge.solutions)
  @JoinTable({ name: 'ChallengeToSolution' })
  challenges: Challenge[];

  @OneToMany(() => Image, (image) => image.solution)
  images: Image[];

  @OneToMany(() => Feedback, (feedback) => feedback.solution)
  feedbacks: Feedback[];

  @OneToOne(() => Pole, (pole) => pole.solutions)
  pole?: Pole;

  @Column({ nullable: true })
  poleId?: number;
}