import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
    constructor(private auth: AuthService) { }

    @Post('login')
    login(@Body() dto: { email: string; password: string }) {
        return this.auth.login(dto.email, dto.password);
    }
    
    @Post('register')
    register(@Body() dto: CreateUserDto) {
        return this.auth.register(dto);
    }
}