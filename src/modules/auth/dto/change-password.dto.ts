import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({ example: 'Checkpoint@123', description: 'Mật khẩu hiện tại' })
  @IsNotEmpty({ message: 'Mật khẩu cũ không được để trống' })
  @IsString()
  oldPassword!: string;

  @ApiProperty({ example: 'NewPassword@123', description: 'Mật khẩu mới (tối thiểu 6 ký tự)' })
  @IsNotEmpty({ message: 'Mật khẩu mới không được để trống' })
  @IsString()
  @MinLength(6, { message: 'Mật khẩu mới phải có ít nhất 6 ký tự' })
  newPassword!: string;
}
