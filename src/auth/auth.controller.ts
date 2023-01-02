import {Body, Controller, Post} from '@nestjs/common';
import {CreateUserDto} from "../user/dto/create-user.dto";
import {AuthService} from "./auth.service";

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) {}

    @Post('/login')
    login(@Body() dto: CreateUserDto) {
        return this.authService.login(dto)
    }

    @Post('/registration')
    registration(@Body() dto: CreateUserDto) {
        return this.authService.registration(dto)
    }

}

