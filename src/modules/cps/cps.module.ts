import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import {
  CpsrService,
  CpstService,
  CpsfService,
  CpsService,
} from './services';
import {
  CpsrController,
  CpstController,
  CpsfController,
  CpsController,
  CpsrChainController,
} from './controllers';

@Module({
  imports: [DatabaseModule],
  controllers: [
    CpsrController,
    CpstController,
    CpsfController,
    CpsController,
    CpsrChainController,
  ],
  providers: [
    CpsrService,
    CpstService,
    CpsfService,
    CpsService,
  ],
  exports: [
    CpsrService,
    CpstService,
    CpsfService,
    CpsService,
  ],
})
export class CpsModule {}
