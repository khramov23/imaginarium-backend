import {HttpException, HttpStatus, Injectable, UnauthorizedException} from '@nestjs/common';
import {CreateUserDto} from "../user/dto/create-user.dto";
import {UserService} from "../user/user.service";
import {JwtService} from "@nestjs/jwt";
import * as bcrypt from 'bcryptjs'
import {UserDocument} from "../user/user.model";

@Injectable()
export class AuthService {

    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService
    ) {}

    async login(dto: CreateUserDto) {
        const user = await this.validateUser(dto)
        return this.generateToken(user )
    }

    async registration(dto: CreateUserDto) {
        const candidate = await this.userService.getByEmail(dto.email)
        if (candidate) {
            throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST)
        }
        const hashedPassword = await bcrypt.hash(dto.password, 5)
        const user = await this.userService.create({...dto, password: hashedPassword})
        return this.generateToken(user)
    }

    private generateToken(user: UserDocument) {
        const payload = {_id: user._id}
        return {
            username: user.username,
            email: user.email,
            role: user.role,
            token: this.jwtService.sign(payload)
        }
    }

    private async validateUser(dto: CreateUserDto) {
        const user = await this.userService.getByEmail(dto.email)
        const passwordEquals = await bcrypt.compare(dto.password, user.password)
        if (user && passwordEquals)
            return user
        throw new UnauthorizedException({message: "Incorrect email or password"})
    }


}
