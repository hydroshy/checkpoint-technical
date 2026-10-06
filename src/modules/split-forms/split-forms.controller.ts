/**
 * Legacy re-export Controller wrapper for Split Forms.
 * Controllers have been split into independent domain modules:
 * - CpsModule (CpsrController, CpstController, CpsfController, CpsController, CpsrChainController)
 * - AnalyticsReportModule (ControlPanelApiController)
 */
export {
  CpsrController,
  CpstController,
  CpsfController,
  CpsController,
  CpsrChainController,
} from '../cps/controllers';

export {
  ControlPanelApiController,
} from '../analytics-report/controllers/control-panel-api.controller';
