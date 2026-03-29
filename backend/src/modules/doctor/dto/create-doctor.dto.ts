import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateDoctorDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  crm: string;

  @IsUUID()
  specialtyId: string;
}
