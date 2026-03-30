import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreatePatientPlanDto {
  @ApiProperty({ example: 'uuid-patient' })
  @IsUUID()
  patientId: string;

  @ApiProperty({ example: 'uuid', description: 'Health Plan ID (UUID)' })
  @IsUUID()
  healthPlanId: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @IsNotEmpty()
  contractNumber: string;
}
