import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";

@Injectable()
export class JwtAuthGuard implements CanActivate {

    constructor(
        private readonly jwtService: JwtService
    ) {}

    canActivate(context: ExecutionContext) {
        const req = context.switchToHttp().getRequest()
        try {
            const authHeader = req.headers.authorization
            if (!authHeader) {
                throw new UnauthorizedException({message: "No authorization header in the request"})
            }
            const accessToken = authHeader.split(" ")[1]
            if (!accessToken) {
                throw new UnauthorizedException({message: "No access token in the request"})
            }

            const userData = this.jwtService.verify(accessToken, {
                secret: process.env.JWT_ACCESS
            })
            if (!userData) {
                throw new UnauthorizedException({message: "Invalid access token"})
            }
            console.log(userData)
            req.user = userData
            return true
        } catch (e) {
            throw new UnauthorizedException({message: e.message})
        }
    }

}

