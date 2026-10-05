import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { SplitFormsService } from './split-forms.service';
import {
  CpsrController,
  CpstController,
  CpsfController,
  CpsController,
  CpsrChainController,
  ControlPanelApiController,
} from './split-forms.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [
    CpsrController,
    CpstController,
    CpsfController,
    CpsController,
    CpsrChainController,
    ControlPanelApiController,
  ],
  providers: [SplitFormsService],
  exports: [SplitFormsService],
})
export class SplitFormsModule {}
