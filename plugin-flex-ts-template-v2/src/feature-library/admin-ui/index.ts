import { Actions } from '@twilio/flex-ui';

import { FeatureDefinition } from '../../types/feature-loader';
import { isFeatureEnabled } from './config';
// @ts-ignore
import hooks from './flex-hooks/**/*.*';
// @ts-ignore
import adminHooks from '../*/admin-hook.tsx';

export const register = (): FeatureDefinition => {
  if (!isFeatureEnabled()) return {};

  // load other features' admin hooks
  const adminHooksArr = typeof adminHooks === 'undefined' ? [] : adminHooks;
  const adminEvent = 'beforeOpenFeatureSettings';
  for (const adminHook of adminHooksArr) {
    if (!adminHook.adminHook) {
      continue;
    }
    Actions.addListener(adminEvent, async (payload, _abortFunction) => {
      adminHook.adminHook(payload);
    });
    console.info(
      `Feature admin-ui registered %c${adminEvent} %caction hook: %c${adminHook.adminHook.name}`,
      'font-weight:bold',
      'font-weight:normal',
      'font-weight:bold',
    );
  }

  return { name: 'admin-ui', hooks: typeof hooks === 'undefined' ? [] : hooks };
};
