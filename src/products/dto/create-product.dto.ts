import { Type } from "class-transformer";
import { IsNumber, IsString, Min } from "class-validator";

export class CreateProductDto {

    @IsString()
    public name: string;


    @Type(() => Number)
    @IsNumber({
        maxDecimalPlaces: 4
    })
    @Min(0)
    public price: number;


}
