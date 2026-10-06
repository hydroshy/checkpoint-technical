import { execSync } from 'child_process';
import * as path from 'path';

const tests = [
  'test/view-syntax-check.spec.ts',
  'test/qa-system-verification.spec.ts',
  'test/rbac.spec.ts',
  'test/backend-ticket-mgmt.spec.ts',
  'test/report-and-control-panel.e2e.ts',
  'test/modular-backend.spec.ts',
  'test/frontend-navigation-modals.spec.ts',
  'test/assign-task-module.spec.ts',
  'test/backend-perf-and-chain.spec.ts',
  'test/management-task-module.spec.ts',
  'test/cpsr-display-and-edit.spec.ts',
  'test/dynamic-downtime.spec.ts',
  'test/ui-popup-cleanup.spec.ts',
  'test/report-technical-layout-4m-gantt.spec.ts',
];

console.log('================================================================');
console.log('🏁 CHẠY TOÀN BỘ TEST SUITE HỆ THỐNG CHECKPOINT TECHNICAL');
console.log('================================================================\n');

let allPassed = true;

for (const testFile of tests) {
  console.log(`\n▶ ĐANG CHẠY: ${testFile}...`);
  try {
    execSync(`npx ts-node ${testFile}`, {
      cwd: path.resolve(__dirname, '..'),
      stdio: 'inherit',
    });
    console.log(`✔ [PASS] ${testFile}`);
  } catch (err) {
    console.error(`✖ [FAIL] ${testFile}`);
    allPassed = false;
    break;
  }
}

if (allPassed) {
  console.log('\n================================================================');
  console.log('🎉 TOÀN BỘ TEST SUITE ĐÃ HOÀN THÀNH VÀ ĐẠT 100%!');
  console.log('================================================================\n');
  process.exit(0);
} else {
  console.error('\n❌ CÓ TEST THẤT BẠI!');
  process.exit(1);
}
