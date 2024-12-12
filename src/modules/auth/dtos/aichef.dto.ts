import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, ArrayMinSize, ValidateNested, IsOptional } from "class-validator";
import { IngredientDto } from "src/modules/posts/dtos/create-post.dto";

export class GetRecipeDto {
    @ApiProperty({
        description: 'Danh sách nguyên liệu của các món ăn',
        example: [
            { name: 'Thịt lợn', quantity: '500g' },
            { name: 'Thịt gà', quantity: '300g' },
            { name: 'Gừng', quantity: '2 củ' },
            { name: 'Hành tím', quantity: '2 củ' }
        ]
    })
    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => IngredientDto)
    ingredients: IngredientDto[];

    @ApiProperty({
        description: 'Danh sách tên các món ăn cần nấu từ những nguyên liệu trên',
        example: ['Thịt lợn nướng', 'Gà luộc']
    })
    @IsOptional()
    recipes?: string[];


    @IsOptional()
    @ApiProperty({
        description: 'Ghi chú',
        example: 'Dành cho người thất tình'
    })
    note?: string;
}
