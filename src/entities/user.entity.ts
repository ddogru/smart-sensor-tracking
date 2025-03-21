import { BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Base } from './base';
import { Role } from './role.entity';
import * as bcrypt from 'bcryptjs';
import { Company } from './company.entity';
import { UserLog } from './user.log.entity';
import { Sensor } from './sensor.entity';

@Entity('user')
export class User extends Base {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { nullable: false })
  name: string;

  @Column('varchar', { nullable: false, unique: true })
  email: string;

  @Column('varchar', { nullable: false })
  password: string;

  @ManyToOne(() => Role, (role) => role.id, { eager: true })
  role: Role;

  @ManyToOne(() => Company, (company) => company.users, { nullable: true })
  @JoinColumn({ name: 'companyId' })
  company: Company;

  @ManyToMany(() => Sensor, (sensor) => sensor.users)
  @JoinTable()
  sensors: Sensor[];


  @OneToMany(() => UserLog, (userLog) => userLog.user, { nullable: true })
  userLogs: UserLog[];


}
