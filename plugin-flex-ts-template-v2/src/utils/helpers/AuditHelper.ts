import { Manager } from '@twilio/flex-ui';

import SyncClient from '../sdk-clients/sync/SyncClient';
import { getFeatureFlags } from '../configuration';
import logger from '../logger';

const AUDIT_LIST_PREFIX = 'AuditLog';
const { audit_log_ttl = 1209600 } = getFeatureFlags().common || {};

const performSave = async (feature: string, data: any) => {
  const list = await SyncClient.list(`${AUDIT_LIST_PREFIX}_${feature}`);
  await list.push(data, { ttl: audit_log_ttl });
};

export const saveAuditEvent = async (feature: string, event: string, oldValue?: any, newValue?: any) => {
  const data = {
    timestamp: new Date().toString(),
    worker: Manager.getInstance().workerClient?.name ?? 'Unknown',
    event,
    oldValue,
    newValue,
  };

  // Validate that the data does not exceed 16 KiB
  if (data.oldValue || data.newValue) {
    const size = new Blob([JSON.stringify(data)]).size;
    if (size >= 16384) {
      data.oldValue = 'Removed due to excessive size';
      data.newValue = 'Removed due to excessive size';
    }
  }

  try {
    await performSave(feature, data);
  } catch (error: any) {
    logger.error('[AuditHelper] Retrying audit event save due to error.', error);
    await performSave(feature, data);
  }
};
