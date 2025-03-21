import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('user_log')
export class UserLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.userLogs, { onDelete: 'CASCADE' }) 
  @JoinColumn({ name: 'userId' })  
  user: User; 

  @Column('varchar')
  action: string; 

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' }) 
  timestamp: Date; 
}
