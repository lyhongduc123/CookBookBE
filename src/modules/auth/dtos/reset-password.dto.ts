// src/modules/auth/dtos/reset-password.dto.ts
import { IsString, MinLength, MaxLength, Matches, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPassword1Dto {

  @IsEmail()
  @ApiProperty({ description: 'Tài khoản gắn với mail cần đặt lại mật khẩu' })
  email: string;

  @IsString()
  @ApiProperty({ description: 'Mã đặt lại mật khẩu' })
  code: string;

}
export class ResetPassword2Dto {

  @IsEmail()
  @ApiProperty({ description: 'Tài khoản gắn với mail cần đặt lại mật khẩu' })
  email: string;

  @IsString()
  @ApiProperty({ description: 'Token đặt lại mật khẩu' })
  token: string;

  @IsString()
  @MinLength(6) 
  @MaxLength(20)
  @Matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/, {
    message: 'Mật khẩu phải chứa ít nhất một chữ cái viết hoa, một chữ cái viết thường và một chữ số',
  })
  @ApiProperty({ description: 'Mật khẩu mới' })
  password: string;

}