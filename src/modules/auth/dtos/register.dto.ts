// src/modules/auth/dtos/register.dto.ts
import { IsString, IsEmail, MinLength, MaxLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  @ApiProperty({ description: 'Tên đăng nhập', example: 'hoapri123' })
  username: string;


  @ApiProperty({ description: 'Email', example: 'hoapri123@gmail.com' })
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(20)
  @Matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/, {
    message: 'Mật khẩu phải chứa ít nhất một chữ cái viết hoa, một chữ cái viết thường và một chữ số',
  })
  @ApiProperty({ description: 'Mật khẩu', example: 'Password123' })
  password: string;
}
