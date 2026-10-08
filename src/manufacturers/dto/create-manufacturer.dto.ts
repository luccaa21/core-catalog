import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateManufacturerDto {
  @ApiProperty({ example: 'Intel' })
  @IsNotEmpty()
  @IsString()
  name: string;
}