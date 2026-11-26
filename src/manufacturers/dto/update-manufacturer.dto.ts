import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UpdateManufacturerDto {
  @ApiProperty({ example: 'Intel' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(60)
  name: string;
}
