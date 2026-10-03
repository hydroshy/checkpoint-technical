import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'admin', description: 'Username or email' })
  @IsNotEmpty()
  @IsString()
  usernameOrEmail!: string;

  @ApiProperty({ example: 'Dvt@123', description: 'Password' })
  @IsNotEmpty()
  @IsString()
  password!: string;
}
