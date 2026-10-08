import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsPositive, IsString, Min } from 'class-validator';

export class CreateComponentDto {
  @ApiProperty({ example: 'Ryzen 7 7800X3D' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'CPU' })
  @IsNotEmpty()
  @IsString()
  category: string;

  @ApiProperty({ example: 189900, description: 'Preço em centavos' })
  @IsInt()
  @IsPositive()
  priceCents: number;

  @ApiProperty({ example: 120 })
  @IsInt()
  @Min(0)
  powerWatts: number;

  @ApiProperty({ example: 1, description: 'ID do fabricante já cadastrado' })
  @IsInt()
  @IsPositive()
  manufacturerId: number;
}