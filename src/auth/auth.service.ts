import {BadRequestException, HttpException, HttpStatus, Injectable, UnauthorizedException} from '@nestjs/common';
import {CreateUserDto} from "../user/dto/create-user.dto";
import {UserService} from "../user/user.service";
import * as bcrypt from 'bcryptjs'
import * as uuid from 'uuid'
import {LoginDto} from "./dto/login.dto";
import {TokenService} from "../token/token.service";
import {UserInfoWithTokens} from "./types/user-info.type";
import {MailService} from "../mail/mail.service";
import {UserDocument} from "../user/user.model";

@Injectable()
export class AuthService {

    constructor(
        private readonly userService: UserService,
        private readonly tokenService: TokenService,
        private readonly mailService: MailService
    ) {
    }

    async login(dto: LoginDto): Promise<UserInfoWithTokens> {
        const user = await this.validateUser(dto)
        const tokens = this.tokenService.generateTokens(user)
        await this.tokenService.saveToken(user._id, tokens.refreshToken)

        return {
            _id: user.id, role: user.role, isActivated: user.isActivated,
            ...tokens
        }
    }

    async registration(dto: CreateUserDto): Promise<UserInfoWithTokens> {
        const candidateByEmail = await this.userService.getByEmail(dto.email)
        if (candidateByEmail) {
            throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST)
        }

        const candidateByUsername = await this.userService.getByUsername(dto.username)
        if (candidateByUsername) {
            throw new HttpException(`Username already exists`, HttpStatus.BAD_REQUEST)
        }

        const hashedPassword = await bcrypt.hash(dto.password, 5)

        const activationLink = uuid.v4()

        const user = await this.userService.create({...dto, password: hashedPassword})
        user.activationLink = activationLink
        await user.save()

        await this.mailService.sendMail(user.email, `${process.env.API_URL}/auth/activate/${user.activationLink}`)

        const tokens = this.tokenService.generateTokens(user)
        await this.tokenService.saveToken(user._id, tokens.refreshToken)

        return {
            _id: user._id,
            role: user.role,
            isActivated: user.isActivated,
            ...tokens
        }
    }

    private async validateUser(dto: LoginDto): Promise<UserDocument> {
        const user = await this.userService.getByEmail(dto.email)
        if (!user)
            throw new UnauthorizedException({message: "Incorrect email or password"})
        const passwordEquals = await bcrypt.compare(dto.password, user.password)
        if (!passwordEquals)
            throw new UnauthorizedException({message: "Incorrect email or password"})
        return user
    }

    async activate(activationLink: string): Promise<UserDocument> {
        const user = await this.userService.getByActivationLink(activationLink)
        if (!user) {
            throw new BadRequestException("Invalid activation link")
        }
        user.isActivated = true
        return user.save()
    }

    async logout(refreshToken: string) {
        return this.tokenService.removeToken(refreshToken)
    }

    async refresh(refreshToken: string): Promise<UserInfoWithTokens> {
        if (!refreshToken) {
            throw new UnauthorizedException({message: "No refresh token error"})
        }
        const userData = await this.tokenService.validateRefreshToken(refreshToken)
        const tokenFromDb = await this.tokenService.findToken(refreshToken)
        if (!userData || !tokenFromDb) {
            throw new UnauthorizedException({message: "Authorization error"})
        }

        const user = await this.userService.getById(userData._id)
        const tokens = this.tokenService.generateTokens(user)
        await this.tokenService.saveToken(user._id, tokens.refreshToken)

        return {
            _id: user._id,
            role: user.role,
            isActivated: user.isActivated,
            ...tokens
        }
    }
}
