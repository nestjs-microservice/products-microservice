import { Type } from "class-transformer";
import { IsOptional, IsPositive } from "class-validator";


export class PaginationArgsDto {

    @Type(() => Number)
    @IsOptional()
    @IsPositive()
    page?: number = 1;

    @Type(() => Number)
    @IsOptional()
    @IsPositive()
    limit?: number = 10;

}