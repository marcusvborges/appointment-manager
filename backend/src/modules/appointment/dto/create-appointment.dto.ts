import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDateString,
  IsOptional,
  IsUUID,
} from 'class-validator';

export class CreateAppointmentDto {
  @IsDateString()
  scheduledAt: string;

  @IsUUID()
  patientId: string;

  @IsUUID()
  doctorId: string;

  @IsBoolean()
  isPrivate: boolean;

  @IsOptional()
  @IsUUID()
  patientPlanId?: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsUUID('4', { each: true })
  procedureIds: string[];
}
