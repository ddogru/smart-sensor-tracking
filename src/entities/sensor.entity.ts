import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, ManyToMany, JoinColumn } from 'typeorm';
import { Base } from './base';
import { Company } from './company.entity';
import { User } from './user.entity';
import { SensorData } from './sensor-data.entity';
import { InvalidSensorDataLog } from './invalid-sensor-data-log.entity';

@Entity()
export class Sensor extends Base {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => Company, (company) => company.sensors, { nullable: false })
  @JoinColumn({ name: 'companyId' })
  company: Company;
  
  @ManyToMany(() => User, (user) => user.sensors)
  users: User[];

  @OneToMany(() => SensorData, (sensorData) => sensorData.sensor, { nullable: true })
  sensorData: SensorData[];

  @OneToMany(() => InvalidSensorDataLog, (invalidSensorDataLog) => invalidSensorDataLog.sensor, { nullable: true })
  invalidSensorDataLogs: InvalidSensorDataLog[];

  
}
