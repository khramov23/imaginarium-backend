import {IsInt, IsOptional} from "class-validator";
import {Transform} from "class-transformer";

export class PaginationParams {
    @IsOptional()
    @IsInt()
    @Transform(({value}) => Number.parseInt(value))
    limit: number

    @IsOptional()
    @IsInt()
    @Transform(({value}) => Number.parseInt(value))
    page: number
}
