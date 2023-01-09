import {Body, Controller, Get, Param, Post, Res, Req} from '@nestjs/common';
import {CreateUserDto} from "../user/dto/create-user.dto";
import {AuthService} from "./auth.service";
import {LoginDto} from "./dto/login.dto";
import {Response, Request} from "express";

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) {}

    @Post('/login')
    async login(@Body() dto: LoginDto, @Res() response: Response): Promise<Response> {
        const userData = await this.authService.login(dto)

        if ("refreshToken" in userData) {
            response.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
        }
        return response.status(200).json({...userData})
    }

    @Post('/registration')
    async registration(@Body() dto: CreateUserDto, @Res() response: Response): Promise<Response> {
        const userData = await this.authService.registration(dto)
        if ("refreshToken" in userData) {
            response.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
        }
        return response.status(200).json({...userData})
    }

    @Post('/logout')
    async logout(@Req() request: Request, @Res() response: Response): Promise<Response> {
        const {refreshToken} = request.cookies
        const token = await this.authService.logout(refreshToken)
        response.clearCookie('refreshToken')
        return response.status(200).json({message: "Logged out"})
    }

    @Post('/refresh')
    async refresh(@Req() request: Request, @Res() response: Response): Promise<Response> {
        const {refreshToken} = request.cookies
        const userData = await this.authService.refresh(refreshToken)
        response.cookie('refreshToken', refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
        return response.status(200).json(userData)
    }

    @Get("/activate/:link")
    async activate(@Param('link') activationLink: string, @Res() response: Response) {
        await this.authService.activate(activationLink)
        return response.redirect(process.env.CLIENT_URL)
    }
}

