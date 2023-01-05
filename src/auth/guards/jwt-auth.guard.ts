import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";

@Injectable()
export class JwtAuthGuard implements CanActivate {

    constructor(private readonly jwtService: JwtService) {}

    canActivate(context: ExecutionContext) {
        const req = context.switchToHttp().getRequest()
        try {
            const authHeader = req.headers.authorization
            const authHeaderSplit = authHeader.split(' ')
            const bearer = authHeaderSplit[0]
            const token = authHeaderSplit[1]
            if (bearer !== "Bearer" || !token) {
                throw new UnauthorizedException({message: "User is not signed"})
            }
            const user = this.jwtService.verify(token)
            req.user = user
            return true
        } catch (e) {
            throw new UnauthorizedException({message: "Incorrect token"})
        }
    }

}

