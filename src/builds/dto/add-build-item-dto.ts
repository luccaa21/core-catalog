import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsPositive, IsOptional } from 'class-validator';

export class AddBuildItemDto {
    @ApiProperty({ example: 1, description: 'ID da peça no catálogo' })
    @IsInt()
    @IsPositive()
    componentId: number;

    @ApiPropertyOptional({ example: 2, default: 1 })
    @IsOptional()
    @IsInt()
    @IsPositive()
    quantity?: number;
}