import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger/dist/decorators/api-property.decorator';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreatePatientDto {
  @ApiProperty({ example: 'José Silva' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '1990-01-01' })
  @IsDateString()
  @IsNotEmpty()
  birthDate: Date;

  @ApiProperty({ example: '999999999' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiPropertyOptional({
    example: 'uuid',
    description: 'Health Plan ID (UUID)',
  })
  @IsOptional()
  @IsUUID()
  healthPlanId?: string;

  @ApiPropertyOptional({ example: '123456' })
  @IsOptional()
  @IsString()
  contractNumber?: string;
}
