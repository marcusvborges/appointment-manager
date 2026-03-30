import { IsNotEmpty, IsString } from 'class-validator';

export class CreateHealthPlanDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  phone: string;
}
