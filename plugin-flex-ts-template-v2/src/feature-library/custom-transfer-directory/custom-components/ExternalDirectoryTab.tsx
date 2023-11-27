import { withTaskContext, ITask, Actions, Manager, useFlexSelector } from '@twilio/flex-ui';
import { useState, useEffect } from 'react';

import { getExternalDirectory, isVoiceXWTEnabled } from '../config';
import { DirectoryEntry, ExternalDirectoryEntry } from '../types/DirectoryEntry';
import AppState from '../../../types/manager/AppState';
import DirectoryTab, { TransferClickPayload } from './DirectoryTab';

export interface OwnProps {
  task: ITask;
}

const ExternalDirectoryTab = (props: OwnProps) => {
  const [directory] = useState(getExternalDirectory() as Array<ExternalDirectoryEntry>);

  const workerAttrs = useFlexSelector((state: AppState) => state.flex.worker.attributes);

  // sort the directory and map to a DirectoryEntry array
  const generateDirectoryEntries = (): Array<DirectoryEntry> => {
    return directory
      .sort((a: ExternalDirectoryEntry, b: ExternalDirectoryEntry) => (a.label > b.label ? 1 : -1))
      .map(
        (entry) =>
          ({
            ...entry,
            warm_transfer_enabled: entry.warm_transfer_enabled && isVoiceXWTEnabled(),
            address: entry.number,
            tooltip: entry.number,
            type: 'number',
          } as DirectoryEntry),
      );
  };

  const onTransferEntryClick = (entry: DirectoryEntry, transferOptions: TransferClickPayload) => {
    const defaultFromNumber = Manager.getInstance().serviceConfiguration.outbound_call_flows.default.caller_id;
    const callerId = workerAttrs.phone
      ? workerAttrs.phone
      : workerAttrs.selectedCallerId
      ? workerAttrs.selectedCallerId
      : defaultFromNumber;

    if (transferOptions.mode === 'WARM')
      Actions.invokeAction('StartExternalWarmTransfer', {
        task: props.task,
        phoneNumber: entry.address,
        callerId,
      });
    else if (transferOptions.mode === 'COLD') {
      let from;
      if (
        (props.task?.attributes?.caller && props.task?.attributes?.caller.startsWith('sip')) ||
        (props.task?.attributes?.called && props.task?.attributes?.called.startsWith('sip'))
      ) {
        // If the call we're transferring is a SIP call, override the caller ID
        // Otherwise, do not specify caller ID (uses caller ANI)
        from = callerId;
      }

      Actions.invokeAction('StartExternalColdTransfer', {
        task: props.task,
        phoneNumber: entry.address,
        callerId: from,
      });
    }
  };

  useEffect(() => {
    generateDirectoryEntries();
  }, [directory]);

  return <DirectoryTab entries={generateDirectoryEntries()} isLoading={false} onTransferClick={onTransferEntryClick} />;
};

export default withTaskContext(ExternalDirectoryTab);
