// src/modules/auth/dtos/reset-password.dto.ts
import { IsString, MinLength, MaxLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @IsString()
  @ApiProperty({ description: 'Mật khẩu cũ', example: 'Password123' })
  oldPassword: string;

  @IsString()
  @MinLength(6)
  @MaxLength(20)
  @Matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/, {
    message: 'Mật khẩu phải chứa ít nhất một chữ cái viết hoa, một chữ cái viết thường và một chữ số',
  })
  @ApiProperty({ description: 'Mật khẩu mới', example: 'Password123' })
  newPassword: string;

  
}
