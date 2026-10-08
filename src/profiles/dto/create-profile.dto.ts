import {
    IsInt,
    IsPositive,
    IsString,
    Length,
    IsOptional,
    IsDateString,
    IsUrl,
    MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProfileDto {
    @ApiProperty({
        example: 1,
        description: 'ID do User dono deste perfil (já cadastrado)',
    })
    @IsInt()
    @IsPositive()
    userId: number;

    @ApiProperty({ example: 'Fulano da Silva' })
    @IsString()
    @Length(2, 120)
    fullName: string;

    @ApiPropertyOptional({ example: '1990-01-15T00:00:00Z' })
    @IsOptional()
    @IsDateString()
    birthDate?: string;

    @ApiPropertyOptional({ example: 'https://exemplo.com/foto.jpg' })
    @IsOptional()
    @IsUrl()
    @MaxLength(500)
    avatarUrl?: string;
}