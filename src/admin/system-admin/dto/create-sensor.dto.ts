import { IsString, IsNotEmpty } from 'class-validator';

export class CreateSensorDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  companyId: string;  
}