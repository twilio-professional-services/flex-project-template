import { v4 as uuidv4 } from 'uuid';
import { Manager } from '@twilio/flex-ui';

import SyncClient from '../sdk-clients/sync/SyncClient';
import { getFeatureFlags } from '../configuration';

const AUDIT_MAP_PREFIX = 'AuditLog';
const { audit_log_ttl = 1209600 } = getFeatureFlags().common || {};

const performSave = async (feature: string, key: string, data: any) => {
  const map = await SyncClient.map(`${AUDIT_MAP_PREFIX}_${feature}`);
  await map.set(key, data, { ttl: audit_log_ttl });
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

  const key = uuidv4();
  try {
    await performSave(feature, key, data);
  } catch (error) {
    console.log('[AuditHelper] Retrying audit event save due to error.', error);
    await performSave(feature, key, data);
  }
};
