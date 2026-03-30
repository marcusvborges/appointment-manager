import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateDoctorDto {
  @ApiProperty({ example: 'Dr. João Silva' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '123456-PE' })
  @IsString()
  @IsNotEmpty()
  crm: string;

  @ApiProperty({ example: 'uuid', description: 'Specialty ID (UUID)' })
  @IsUUID()
  specialtyId: string;
}
