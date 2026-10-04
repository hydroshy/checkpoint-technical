import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class UserPermissionsDto {
  @ApiPropertyOptional({ example: true, description: 'Cho phép tạo phiếu yêu cầu kỹ thuật' })
  @IsOptional()
  @IsBoolean()
  canCreateRequest?: boolean;

  @ApiPropertyOptional({ example: false, description: 'Cho phép xem Dashboard KPI' })
  @IsOptional()
  @IsBoolean()
  canViewKpi?: boolean;

  @ApiPropertyOptional({ example: false, description: 'Cho phép truy cập Control Panel' })
  @IsOptional()
  @IsBoolean()
  canAccessControlPanel?: boolean;
}

export class CreateUserDto {
  @ApiProperty({ example: 'user02', description: 'Tên đăng nhập' })
  @IsNotEmpty()
  @IsString()
  username!: string;

  @ApiPropertyOptional({ example: 'user02@checkpointsystems.com', description: 'Email người dùng' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: 'Checkpoint@123', description: 'Mật khẩu khởi tạo' })
  @IsOptional()
  @IsString()
  password?: string;

  @ApiPropertyOptional({ example: 'Nguyễn Văn B', description: 'Họ và tên đầy đủ' })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiPropertyOptional({ enum: ['ADMIN', 'TECHNICIAN', 'EMPLOYEE'], default: 'EMPLOYEE' })
  @IsOptional()
  @IsEnum(['ADMIN', 'TECHNICIAN', 'EMPLOYEE'])
  role?: 'ADMIN' | 'TECHNICIAN' | 'EMPLOYEE';

  @ApiPropertyOptional({ type: UserPermissionsDto, description: 'Phân quyền chi tiết' })
  @IsOptional()
  @ValidateNested()
  @Type(() => UserPermissionsDto)
  permissions?: UserPermissionsDto;
}

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'Nguyễn Văn B', description: 'Họ và tên đầy đủ' })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiPropertyOptional({ example: 'user02@checkpointsystems.com', description: 'Email người dùng' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ enum: ['ADMIN', 'TECHNICIAN', 'EMPLOYEE'] })
  @IsOptional()
  @IsEnum(['ADMIN', 'TECHNICIAN', 'EMPLOYEE'])
  role?: 'ADMIN' | 'TECHNICIAN' | 'EMPLOYEE';

  @ApiPropertyOptional({ example: true, description: 'Trạng thái hoạt động' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ example: 'NewPassword@123', description: 'Đổi mật khẩu' })
  @IsOptional()
  @IsString()
  password?: string;

  @ApiPropertyOptional({ type: UserPermissionsDto, description: 'Cập nhật phân quyền' })
  @IsOptional()
  @ValidateNested()
  @Type(() => UserPermissionsDto)
  permissions?: UserPermissionsDto;
}

export class UpdateUserPermissionsDto {
  @ApiPropertyOptional({ example: true, description: 'Cho phép tạo phiếu yêu cầu kỹ thuật' })
  @IsOptional()
  @IsBoolean()
  canCreateRequest?: boolean;

  @ApiPropertyOptional({ example: false, description: 'Cho phép xem Dashboard KPI' })
  @IsOptional()
  @IsBoolean()
  canViewKpi?: boolean;

  @ApiPropertyOptional({ example: false, description: 'Cho phép truy cập Control Panel' })
  @IsOptional()
  @IsBoolean()
  canAccessControlPanel?: boolean;

  @ApiPropertyOptional({ type: UserPermissionsDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => UserPermissionsDto)
  permissions?: UserPermissionsDto;
}
