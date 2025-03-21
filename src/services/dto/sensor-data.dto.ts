import { IsString, IsNumber, IsPositive, IsNotEmpty } from 'class-validator';

export class SensorDataDto {
  @IsString()
  @IsNotEmpty()
  sensor_id: string;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  timestamp: number;

  @IsNumber()
  @IsNotEmpty()
  temperature: number;

  @IsNumber()
  @IsNotEmpty()
  humidity: number;
}
