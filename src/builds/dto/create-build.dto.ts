import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class CreateBuildDto {
  @ApiProperty({ example: 'PC Gamer 2026' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 800000, description: 'Orçamento máximo em centavos' })
  @IsInt()
  @IsPositive()
  maxBudgetCents: number;

}