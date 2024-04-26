import { Thematic } from 'src/thematics/entities/thematic.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm';
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
  image_link: string;

  @Column({ nullable: true })
  video_link: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text' })
  targeted_problem: string;

  @Column({ type: 'datetime', nullable: true, default: () => 'now()' })
  created_at?: Date;

  @Column({ type: 'datetime', nullable: true, onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at?: Date;

  @ManyToOne(() => Call, (call) => call.solutions)
  @JoinColumn()
  call: Call;

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
