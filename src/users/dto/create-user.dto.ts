import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, Length, min } from "class-validator";

export class CreateUserDto {

    @ApiProperty({ example: 'Fulano' })
    @IsNotEmpty()
    @Length(3, 100)
    name: string = '';

     @ApiProperty({ example: 'fulano@email.com' })
    @IsNotEmpty()
    email: string = '';

    @IsNotEmpty()
    passwordHash: string = '';

}
