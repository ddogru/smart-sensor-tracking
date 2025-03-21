import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne } from 'typeorm';
import { Base } from './base';
import { Sensor } from './sensor.entity';

@Entity('sensor_data')
export class SensorData extends Base {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Sensor, (sensor) => sensor.sensorData, { nullable: false })
  @JoinColumn({ name: 'sensorId' })
  sensor: Sensor;

  @Column()
  timestamp: Date;

  @Column('float')
  temperature: number;

  @Column('float')
  humidity: number;
  
  
}
