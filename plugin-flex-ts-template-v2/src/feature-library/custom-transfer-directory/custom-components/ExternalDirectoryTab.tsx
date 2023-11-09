import { Alert } from '@twilio-paste/core/alert';
import { Flex } from '@twilio-paste/core/flex';
import { withTaskContext, ITask, Actions, Manager, useFlexSelector, Template, templates } from '@twilio/flex-ui';
import { useState, useRef, useEffect } from 'react';
import debounce from 'lodash/debounce';

import { SearchBox } from './CommonDirectoryComponents';
import { getExternalDirectory, isVoiceXWTEnabled } from '../config';
import { DirectoryEntry, ExternalDirectoryEntry } from '../types/DirectoryEntry';
import { DirectoryItem } from './DirectoryItem';
import AppState from '../../../types/manager/AppState';
import { StringTemplates } from '../flex-hooks/strings/CustomTransferDirectory';

export interface TransferClickPayload {
  mode: 'WARM' | 'COLD';
}

export interface OwnProps {
  task: ITask;
}

const ExternalDirectoryTab = (props: OwnProps) => {
  const [directory] = useState(getExternalDirectory() as Array<ExternalDirectoryEntry>);
  const [filteredDirectory, setFilteredDirectory] = useState([] as Array<DirectoryEntry>);

  const workerAttrs = useFlexSelector((state: AppState) => state.flex.worker.attributes);

  const searchInputRef = useRef<HTMLInputElement>(null);

  // takes the input in the search box and applies it to the queue result
  // this will trigger the useEffect for a queueFilter update
  const onQueueSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // eslint-disable-next-line no-eq-null, eqeqeq
    if (event.target != null) {
      filterDirectoryDebounce();
    }
  };

  // function to filter the generatedQueueList and trigger a rerender
  const filterExternalDirectory = () => {
    const tempDir = directory
      .filter((entry) => {
        const searchString = searchInputRef.current?.value.toLocaleLowerCase() || '';
        return entry.label.toLocaleLowerCase().includes(searchString);
      })
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

    setFilteredDirectory(tempDir);
  };

  const filterDirectoryDebounce = debounce(filterExternalDirectory, 500, { maxWait: 1000 });

  const onTransferEntryClick = (entry: DirectoryEntry) => async (transferOptions: TransferClickPayload) => {
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

    Actions.invokeAction('HideDirectory');
  };

  useEffect(() => {
    filterExternalDirectory();
  }, [directory]);

  return (
    <Flex key="external-directory-tab-list" vertical wrap={false} grow={1} shrink={1}>
      <SearchBox key="key-tab-search-box" onInputChange={onQueueSearchInputChange} inputRef={searchInputRef} />
      <Flex key="external-tab-results" vertical element="TRANSFER_DIR_COMMON_ROWS_CONTAINER">
        {filteredDirectory.length === 0 ? (
          <Alert variant="neutral">
            <Template source={templates[StringTemplates.NoItemsFound]} />
          </Alert>
        ) : (
          Array.from(filteredDirectory).map((entry: DirectoryEntry) => {
            return (
              <DirectoryItem
                task={props.task}
                entry={entry}
                key={`ext-dir-item-${entry.type}-${entry.address}`}
                onTransferClick={onTransferEntryClick(entry)}
              />
            );
          })
        )}
      </Flex>
    </Flex>
  );
};

export default withTaskContext(ExternalDirectoryTab);
