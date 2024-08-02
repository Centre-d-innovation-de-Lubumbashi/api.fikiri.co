import { Thematic } from 'src/app/modules/thematics/entities/thematic.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { Challenge } from '../../challenges/entities/challenge.entity';
import { Status } from '../../status/entities/status.entity';
import { Feedback } from '../../feedbacks/entities/feedback.entity';
import { Pole } from '../../poles/entities/pole.entity';
import { Event } from '../../events/entities/event.entity';
import { Image } from '../../images/entities/image.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Solution {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  name: string;

  @Column({ nullable: true })
  video_link: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text' })
  targeted_problem: string;

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updated_at: Date;

  @ManyToOne(() => Event, (event) => event.solutions)
  @JoinColumn()
  event: Event;

  @ManyToOne(() => Status, (status) => status.solutions)
  @JoinColumn()
  status: Status;

  @ManyToOne(() => Thematic, (thematic) => thematic.solutions)
  @JoinColumn()
  thematic: Thematic;

  @ManyToOne(() => User, (user) => user.solutions)
  user: User;

  @ManyToMany(() => Challenge, (challenge) => challenge.solutions)
  @JoinTable()
  challenges: Challenge[];

  @OneToMany(() => Image, (image) => image.solution)
  images: Image[];

  @ManyToMany(() => Feedback, (feedback) => feedback.solutions)
  @JoinTable()
  feedbacks: Feedback[];

  @ManyToOne(() => Pole, (pole) => pole.solutions)
  @JoinColumn()
  pole: Pole;
}
