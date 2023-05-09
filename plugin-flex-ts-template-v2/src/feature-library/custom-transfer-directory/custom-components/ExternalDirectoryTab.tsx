import { Flex, Alert } from '@twilio-paste/core';
import { withTaskContext, ITask, Actions } from '@twilio/flex-ui';
import { useState, useRef, useEffect } from 'react';
import { debounce } from 'lodash';

import { SearchBox } from './CommonDirectoryComponents';
import { getExternalDirectory } from '../config';
import { ExternalDirectoryEntry } from '../types/ServiceConfiguration';
import { ExternalItem } from './ExternalItem';

export interface TransferClickPayload {
  mode: 'WARM' | 'COLD';
}

export interface OwnProps {
  task: ITask;
}

const ExternalDirectoryTab = (props: OwnProps) => {
  const [directory] = useState(getExternalDirectory() as Array<ExternalDirectoryEntry>);
  const [filteredDirectory, setFilteredDirectory] = useState([] as Array<ExternalDirectoryEntry>);

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
      .sort((a: ExternalDirectoryEntry, b: ExternalDirectoryEntry) => (a.label > b.label ? 1 : -1));

    setFilteredDirectory(tempDir);
  };

  const filterDirectoryDebounce = debounce(filterExternalDirectory, 500, { maxWait: 1000 });

  const onTransferEntryClick = (entry: ExternalDirectoryEntry) => async (transferOptions: TransferClickPayload) => {
    if (transferOptions.mode === 'WARM')
      await Actions.invokeAction('StartExternalWarmTransfer', { task: props.task, phoneNumber: entry.number });
    else if (transferOptions.mode === 'COLD')
      await Actions.invokeAction('StartExternalColdTransfer', { task: props.task, phoneNumber: entry.number });

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
          <Alert variant="neutral">No External Directory Items Found</Alert>
        ) : (
          Array.from(filteredDirectory).map((entry: ExternalDirectoryEntry, index: number) => {
            return (
              <ExternalItem
                task={props.task}
                index={index}
                entry={entry}
                key={`ext-dir-item-${index}`}
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
