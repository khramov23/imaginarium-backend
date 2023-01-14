import {
    CanActivate,
    ExecutionContext,
    HttpException,
    HttpStatus,
    Injectable,
    UnauthorizedException
} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import {Reflector} from "@nestjs/core";
import {ROLES_KEY} from "../decorators/roles.decorator";

@Injectable()
export class RolesGuard implements CanActivate {

    constructor(
        private readonly jwtService: JwtService,
        private readonly reflector: Reflector
    ) {}

    canActivate(context: ExecutionContext) {
        const req = context.switchToHttp().getRequest()
        try {
            const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
                context.getHandler(),
                context.getClass()
            ])
            if (!requiredRoles)
                return true

            const authHeader = req.headers.authorization
            const authHeaderSplit = authHeader.split(' ')
            const bearer = authHeaderSplit[0]
            const token = authHeaderSplit[1]
            if (bearer !== "Bearer" || !token) {

                throw new UnauthorizedException({message: "User is not signed"})
            }

            const userData = this.jwtService.verify(token, {
                secret: process.env.JWT_ACCESS
            })
            if (!userData) {
                throw new UnauthorizedException({message: "Invalid access token"})
            }

            req.user = userData

            return requiredRoles.includes(userData.role)
        } catch (e) {
            throw new HttpException('Not accepted', HttpStatus.FORBIDDEN)
        }
    }

}