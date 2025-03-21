import { Injectable, OnModuleInit } from '@nestjs/common';
import * as mqtt from 'mqtt';
import { SensorData } from 'src/entities/sensor-data.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { SensorDataDto } from './dto/sensor-data.dto';
import { validate } from 'class-validator';
import { LogService } from 'src/admin/log/log.service';
import { Sensor } from 'src/entities/sensor.entity';
import * as fs from 'fs';


@Injectable()
export class MqttService implements OnModuleInit {
  private mqttClient: mqtt.MqttClient;

  constructor(
    @InjectRepository(SensorData)
    private sensorDataRepository: Repository<SensorData>,
    private dataSource: DataSource,
    private readonly logService: LogService,
  ) { }

  async onModuleInit() {
    console.log('MQTT Service initializing...');

    const options: mqtt.IClientOptions = {
      key: fs.readFileSync('/Users/dilaradogru/mosquitto_certs/mosquitto.key'),
      cert: fs.readFileSync('/Users/dilaradogru/mosquitto_certs/mosquitto.crt'),
      ca: fs.readFileSync('/Users/dilaradogru/mosquitto_certs/mosquitto.crt'), 
      rejectUnauthorized: false,
    };
    
    this.mqttClient = mqtt.connect('mqtts://localhost:8883', options);

    // subscribe to the topic(s)
    this.mqttClient.subscribe('sensor/#', (err) => {
      if (err) {
        console.error('Failed to subscribe to topic:', err);
      } else {
        console.log('Successfully subscribed to topic: sensor/#');
      }
    });

    // listen for incoming messages
    this.mqttClient.on('message', (topic, message) => {
      console.log('Received message on topic:', topic);
      const payload = JSON.parse(message.toString());
      console.log('Message Payload:', payload);

      this.processSensorData(payload);
    });
  }

  
  async processSensorData(payload: any) {
    
    const sensorDataDto = new SensorDataDto();
    sensorDataDto.sensor_id = payload.sensor_id;
    sensorDataDto.timestamp = payload.timestamp;
    sensorDataDto.temperature = payload.temperature;
    sensorDataDto.humidity = payload.humidity;

    const errors = await validate(sensorDataDto);
    if (errors.length > 0) {
      
      console.error('Validation failed:', errors);
      
      await this.logService.logInvalidSensorData(
        sensorDataDto.sensor_id,
        payload,
        'Validation error'
      );

      return; // if invalid dont do anything
    }

    this.saveSensorData(sensorDataDto);
  }

  // save sensor data to db
  async saveSensorData(sensorDataDto: SensorDataDto) {

    const sensorData = new SensorData();

    sensorData.sensor = new Sensor();
    sensorData.sensor.id = sensorDataDto.sensor_id;

    const timestamp = new Date(sensorDataDto.timestamp * 1000); //milliseconds

    sensorData.timestamp = timestamp;

    sensorData.temperature = sensorDataDto.temperature;
    sensorData.humidity = sensorDataDto.humidity;

    console.log('Saving sensor data:', sensorData);

    try {
      await this.sensorDataRepository.save(sensorData);
      console.log('Data saved to DB:', sensorData);
    } catch (error) {
      console.error('Error saving sensor data:', error);
    }
  }

  
}

/**
 * 
 * 
  mosquitto_pub -h localhost -t "sensor/a87bbebd-92b1-4db3-90e3-2a1fd7858665" -m '{
    "sensor_id": "a87bbebd-92b1-4db3-90e3-2a1fd7858665",
    "timestamp": 1710772800,
    "temperature": 25.4,
    "humidity": 55.2
  }'

  encrypted message:

  mosquitto_pub -h localhost -p 8883 --cafile /Users/dilaradogru/mosquitto_certs/mosquitto.crt -t "sensor/4eb9e05b-1d83-442f-b876-5dfabcc88387" -m '{
    "sensor_id": "4eb9e05b-1d83-442f-b876-5dfabcc88387",
    "timestamp": 1710772800,
    "temperature": 85.7,
    "humidity": 45.9
}'


dilaradogru@192 mosquitto_certs % openssl genpkey -algorithm RSA -out mosquitto.key
.+++++++++++++++++++++++++++++++++++++++*.+..+.......+...+..+...+.............+...+..+.........+.+..+...+...+....+++++++++++++++++++++++++++++++++++++++*.+...+....+....................+.+...+..+...+...............+......+.+........+....+..+...................+.....+.......+..+...+.........+....+......+........+.+............+..+...+...+......+......+...+..........+......+........+......+....+...+..............+.+..+......+.......+..+..........+............+....................+.+..+.......+.....+....+..+.............+..+....+...+.....+.......+......+.........+...+.....+..........+...+...+.....+.......+...++++++
..+.+.....+..........+......+.....+...+.............+..+...+.........+.+...+.....+......+......+.........+...+.+.........+++++++++++++++++++++++++++++++++++++++*.+.....+....+.....+............+++++++++++++++++++++++++++++++++++++++*....+.....+.......+.....+.+.........+........+.+..+............+............+......+.........+...+.+......+...+..+..........+...+.....+.+..+...+....+...+...+.....+.+.....+......+....+......+..+...+.............+...............+......+...+.....+.+.....+....+...........+....+..+...+.......+....................+......+...+.+.....+......+.......+...+.........+...........+...+.+...+.................+...+......+.......+.....+.......+..+...+...+...+....+...........+.........+.+...........+......+....+........+..........+..................+..+.+..+.........+.+.....+....+......+............+........+.......++++++


 */
