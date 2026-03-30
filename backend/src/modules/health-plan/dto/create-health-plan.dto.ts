import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateHealthPlanDto {
  @ApiProperty({ example: 'Bradesco' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '0800-123456' })
  @IsString()
  @IsNotEmpty()
  phone: string;
}
