import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Base } from './base';
import { Sensor } from './sensor.entity';

@Entity()
export class Company extends Base {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @OneToMany(() => User, (user) => user.company)
  users: User[];

  @OneToMany(() => Sensor, (sensor) => sensor.company)
  sensors: Sensor[];

  
}
