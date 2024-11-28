import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class IngredientDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: 'Tên nguyên liệu', example: 'Thịt heo' })
    name: string;
  
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: 'Số lượng nguyên liệu', example: '500g' })
    quantity: string;
  }
export class ReponseRecipeDto {
  @ApiProperty({ description: 'Tên món ăn', example: 'Bún bò Huế' })
  name: string;

  @ApiProperty({ description: 'Mô tả', example: 'Món ăn ngon' })
  description: string;
  @ApiProperty({ description: 'Danh sách nguyên liệu', example: [{ name: 'Sườn heo non', quantity: '500g' }, { name: 'Hành', quantity: '1 củ' }, { name: 'Cà chua', quantity: '2 quả' }] })
  ingredients: IngredientDto[];
  @ApiProperty({ description: 'Hướng dẫn', example: ['Nấu bún', 'xào bò'] })
  instructions: string[];

}
export class CreateRecipeDto {
    @ApiProperty({ description: 'Tên món ăn', example: 'Bún bò Huế' })
    name?: string;
    
    @ApiProperty({ description: 'Ghi chú', example: 'Món bún bò Huế của Việt Nam, phải nấu thật mặn, không có tiết.' })
    note?: string;
    
    @ApiProperty({ description: 'Nguyên liệu', example: ['Bún', 'Bò', 'Rau sống'] })
    ingredient?: IngredientDto[];
    
    @ApiProperty({ description: 'Thời gian nấu', example: '30 phút' })
    cookTime?: string;
    
    @ApiProperty({ description: 'Phần ăn', example: '2 người' })
    portion?: string;
    
    @ApiProperty({ description: 'Loại món ăn', example: ['starter', 'main dish', 'dessert'] })
    type?: string;
}
