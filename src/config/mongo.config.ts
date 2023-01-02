import { ConfigService } from "@nestjs/config";

export const getMongoConfig = async (configService: ConfigService) => ({
    uri: configService.get('DB_URL')
})