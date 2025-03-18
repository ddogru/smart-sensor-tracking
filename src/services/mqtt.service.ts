import { Injectable, OnModuleInit } from '@nestjs/common';
import * as mqtt from 'mqtt';
import { SensorData } from 'src/entities/sensor-data.entity'; // Your entity for storing sensor data
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class MqttService implements OnModuleInit {
  private mqttClient: mqtt.MqttClient;

  // Inject the repository for saving SensorData into the database
  constructor(
    @InjectRepository(SensorData)
    private sensorDataRepository: Repository<SensorData>,
  ) {}

  onModuleInit() {
    // Connect to MQTT broker (replace with your broker address)
    this.mqttClient = mqtt.connect('mqtt://broker_address');

    // Subscribe to the topic(s)
    this.mqttClient.subscribe('sensor/#', (err) => {
      if (err) {
        console.error('Failed to subscribe to topic');
      }
    });

    // Listen for incoming messages
    this.mqttClient.on('message', (topic, message) => {
      const payload = JSON.parse(message.toString());
      // Process and save the data into the database
      this.saveSensorData(payload);
    });
  }

  // Method to save sensor data to the database
  async saveSensorData(payload: any) {
    const sensorData = new SensorData();
    sensorData.sensorId = payload.sensor_id;
    sensorData.timestamp = new Date(payload.timestamp * 1000); // Convert Unix timestamp
    sensorData.temperature = payload.temperature;
    sensorData.humidity = payload.humidity;

    // Save sensor data to the database using the repository
    await this.sensorDataRepository.save(sensorData);
  }
}
