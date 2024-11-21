import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ForgotDto {
  @IsEmail()
  @ApiProperty({ description: 'Email' })
  email: string;
}
