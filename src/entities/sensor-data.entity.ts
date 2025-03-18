import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('sensor_data')
export class SensorData {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  sensorId: string;

  @Column()
  timestamp: Date;

  @Column()
  temperature: number;

  @Column()
  humidity: number;
}
