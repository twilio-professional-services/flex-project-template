import { withTaskContext, ITask, Actions, Manager, useFlexSelector } from '@twilio/flex-ui';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

import { getExternalDirectory, isVoiceXWTEnabled } from '../config';
import { DirectoryEntry } from '../types/DirectoryEntry';
import AppState from '../../../types/manager/AppState';
import { reduxNamespace } from '../../../utils/state';
import DirectoryTab, { TransferClickPayload } from './DirectoryTab';

export interface OwnProps {
  task: ITask;
}

const ExternalDirectoryTab = (props: OwnProps) => {
  const [directory, setDirectory] = useState([] as Array<DirectoryEntry>);

  const workerAttrs = useFlexSelector((state: AppState) => state.flex.worker.attributes);
  const myContactList = useSelector((state: AppState) => state[reduxNamespace]?.contacts?.directory);
  const sharedContactList = useSelector((state: AppState) => state[reduxNamespace]?.contacts?.sharedDirectory);

  // Map the configurable entries to a DirectoryEntry array
  const generateDirectoryEntries = (): Array<DirectoryEntry> => {
    return getExternalDirectory().map(
      (entry) =>
        ({
          ...entry,
          warm_transfer_enabled: entry.warm_transfer_enabled && isVoiceXWTEnabled(),
          address: entry.number,
          tooltip: entry.number,
          type: 'number',
          key: uuidv4(),
        } as DirectoryEntry),
    );
  };

  // Map the contacts directory entries to a DirectoryEntry array
  const generateContactsEntries = (shared: boolean): Array<DirectoryEntry> => {
    return (
      (shared ? sharedContactList : myContactList)?.map(
        (entry: any) =>
          ({
            cold_transfer_enabled: true,
            warm_transfer_enabled: isVoiceXWTEnabled(),
            label: entry.name,
            address: entry.phoneNumber,
            tooltip: entry.phoneNumber,
            type: 'number',
            key: uuidv4(),
          } as DirectoryEntry),
      ) ?? [] // Return an empty array if the contacts feature is disabled
    );
  };

  useEffect(() => {
    // Combine the configurable directory entries with contacts from the contacts feature
    // Then sort the complete directory by name
    setDirectory(
      generateDirectoryEntries()
        .concat(generateContactsEntries(false))
        .concat(generateContactsEntries(true))
        .sort((a: DirectoryEntry, b: DirectoryEntry) => (a.label.toLowerCase() > b.label.toLowerCase() ? 1 : -1)),
    );
  }, [myContactList, sharedContactList]);

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

  return <DirectoryTab entries={directory} isLoading={false} onTransferClick={onTransferEntryClick} />;
};

export default withTaskContext(ExternalDirectoryTab);
