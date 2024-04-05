import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Quotation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  mention: string;

  @Column({ nullable: true, type: 'float' })
  average?: number;

  @Column({ nullable: true, default: () => 'now()' })
  createdAt?: Date;

  @Column({ nullable: true, onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt?: Date;
}