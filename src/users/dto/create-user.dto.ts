import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsString, Length, min, MinLength } from "class-validator";

export class CreateUserDto {

    @ApiProperty({ example: 'Fulano' })
    @IsNotEmpty()
    @Length(3, 100)
    name: string = '';

    @ApiProperty({ example: 'fulano@email.com' })
    @IsNotEmpty()
    email: string = '';

    @ApiProperty({ example: 'senha123', minLength: 6 })
    @IsString()
    @MinLength(6)
    @IsNotEmpty()
    password: string = '';

}
