import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDateString,
  IsOptional,
  IsUUID,
} from 'class-validator';

export class CreateAppointmentDto {
  @ApiProperty({ example: '2026-03-30T14:00:00.000Z' })
  @IsDateString()
  scheduledAt: string;

  @ApiProperty({ example: 'uuid', description: 'Patient ID (UUID)' })
  @IsUUID()
  patientId: string;

  @ApiProperty({ example: 'uuid', description: 'Doctor ID (UUID)' })
  @IsUUID()
  doctorId: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  isPrivate: boolean;

  @ApiPropertyOptional({
    example: 'uuid-patient-plan',
    description: 'Required when isPrivate is false',
  })
  @IsOptional()
  @IsUUID()
  patientPlanId?: string;

  @ApiProperty({
    type: [String],
    example: ['uuid-procedure-1', 'uuid-procedure-2'],
    description: 'List of procedure IDs (at least one required)',
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsUUID('4', { each: true })
  procedureIds: string[];
}
