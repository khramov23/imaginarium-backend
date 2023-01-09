import {Module} from '@nestjs/common';
import {TokenService} from './token.service';
import {JwtModule} from "@nestjs/jwt";
import {MongooseModule} from "@nestjs/mongoose";
import {Token, TokenSchema} from "./token.model";

@Module({
    imports: [
        JwtModule,
        MongooseModule.forFeature([
            {name: Token.name, schema: TokenSchema}
        ])
    ],
    providers: [TokenService],
    exports: [TokenService]
})
export class TokenModule {
}
