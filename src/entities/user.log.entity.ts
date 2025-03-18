import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity('user_log')
export class UserLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @Column('varchar')
  action: string; // action like 'viewed_logs'

  @Column('timestamp')
  timestamp: Date; 
}
