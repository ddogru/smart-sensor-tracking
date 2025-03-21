import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('role')
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string; // 'system_admin', 'company_admin', 'user'
}
