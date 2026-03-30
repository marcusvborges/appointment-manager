import { PartialType } from '@nestjs/swagger';
import { CreatePatientPlanDto } from './create-patient-plan.dto';

export class UpdatePatientPlanDto extends PartialType(CreatePatientPlanDto) {}
