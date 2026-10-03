import { PartialType } from '@nestjs/swagger';
import { CreateTechnicalRequestDto } from './create-technical-request.dto';

export class UpdateTechnicalRequestDto extends PartialType(CreateTechnicalRequestDto) {}
