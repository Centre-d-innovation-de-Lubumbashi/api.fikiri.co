import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Solution } from '../../solutions/entities/solution.entity';

@Entity()
export class Image {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  imageLink: string;

  @Column({ nullable: true, default: () => 'now()' })
  createdAt?: Date;

  @Column({ nullable: true, onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt?: Date;

  @ManyToMany(() => Solution, (solution) => solution.images)
  solution: Solution;
}
