import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne } from "typeorm";
import { Sensor } from "./sensor.entity";

@Entity('invalid_sensor_data_log')
export class InvalidSensorDataLog {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Sensor, (sensor) => sensor.invalidSensorDataLogs, { nullable: false })
    @JoinColumn({ name: 'sensorId' })
    sensor: Sensor;

    @Column('json')
    invalid_data: object;

    @Column()
    error_message: string;

    @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
    timestamp: Date;
}
