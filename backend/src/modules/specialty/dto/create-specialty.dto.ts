import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSpecialtyDto {
  @ApiProperty({ example: 'Cardiologia' })
  @IsString()
  @IsNotEmpty()
  name: string;
}
