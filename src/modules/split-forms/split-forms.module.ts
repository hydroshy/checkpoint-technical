import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { SplitFormsService } from './split-forms.service';
import {
  CpsrController,
  CpstController,
  CpsfController,
  CpsrChainController,
} from './split-forms.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [
    CpsrController,
    CpstController,
    CpsfController,
    CpsrChainController,
  ],
  providers: [SplitFormsService],
  exports: [SplitFormsService],
})
export class SplitFormsModule {}
