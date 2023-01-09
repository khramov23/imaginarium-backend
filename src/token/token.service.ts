import { Injectable } from '@nestjs/common';
import {UserDocument} from "../user/user.model";
import {JwtService} from "@nestjs/jwt";
import {InjectModel} from "@nestjs/mongoose";
import {Token, TokenDocument} from "./token.model";
import {Model, Types} from "mongoose";
import {Tokens} from "./token.type";
import * as process from "process";
import {UserInfo} from "../auth/types/user-info.type";

@Injectable()
export class TokenService {

    constructor(
        @InjectModel(Token.name) private readonly tokenModel: Model<TokenDocument>,
        private readonly jwtService: JwtService
    ) {}

    generateTokens(user: UserDocument): Tokens {
        const payload = {_id: user._id, role: user.role.value, isActivated: user.isActivated}
        const accessToken = this.jwtService.sign(payload, {
            secret: process.env.JWT_ACCESS,
            expiresIn: '30m'
        })
        const refreshToken = this.jwtService.sign(payload, {
            secret: process.env.JWT_REFRESH,
            expiresIn: '30d'
        })
        return {accessToken, refreshToken}
    }

    async saveToken(userId: Types.ObjectId | string, refreshToken: string): Promise<TokenDocument> {
        const tokenData = await this.tokenModel.findOne({user: userId})
        if (tokenData) {
            tokenData.refreshToken = refreshToken
            return tokenData.save()
        }
        return this.tokenModel.create({user: userId, refreshToken})
    }

    async validateRefreshToken(token: string): Promise<UserInfo | null> {
        try {
            const userData = this.jwtService.verify(token, {secret: process.env.JWT_REFRESH})
            return userData
        } catch (e) {
            return null
        }
    }

    async findToken(refreshToken: string): Promise<TokenDocument> {
        return this.tokenModel.findOne({refreshToken})
    }


    async removeToken(refreshToken: string): Promise<void> {
        return this.tokenModel.findOneAndDelete({refreshToken})
    }

}
