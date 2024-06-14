import { Alert } from '@twilio-paste/core/alert';
import { Flex } from '@twilio-paste/core/flex';
import { Spinner } from '@twilio-paste/core/spinner';
import { withTaskContext, ITask, Actions, Template, templates } from '@twilio/flex-ui';
import { useState, useRef, useEffect } from 'react';
import debounce from 'lodash/debounce';

import DirectoryItem from './DirectoryItem';
import SearchBox from './SearchBox';
import { StringTemplates } from '../flex-hooks/strings/CustomTransferDirectory';
import { DirectoryEntry } from '../types/DirectoryEntry';

export interface TransferClickPayload {
  mode: 'WARM' | 'COLD';
}

export interface OwnProps {
  task: ITask;
  entries: Array<DirectoryEntry>;
  isLoading: boolean;
  noEntriesMessage?: string;
  onTransferClick: (entry: DirectoryEntry, transferOptions: TransferClickPayload) => void;
}

const DirectoryTab = (props: OwnProps) => {
  const [filteredDirectory, setFilteredDirectory] = useState([] as Array<DirectoryEntry>);

  const searchInputRef = useRef<HTMLInputElement>(null);

  // takes the input in the search box and applies it to filter the entry list
  const onQueueSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // eslint-disable-next-line no-eq-null, eqeqeq
    if (event.target != null) {
      filterDirectoryDebounce();
    }
  };

  // function to filter the entries and trigger a re-render
  const filterDirectory = () => {
    const tempDir = props.entries.filter((entry) => {
      const searchString = searchInputRef.current?.value.toLocaleLowerCase() || '';
      return entry.label.toLocaleLowerCase().includes(searchString);
    });

    setFilteredDirectory(tempDir);
  };

  const filterDirectoryDebounce = debounce(filterDirectory, 500, { maxWait: 1000 });

  const onTransferEntryClick = (entry: DirectoryEntry) => async (transferOptions: TransferClickPayload) => {
    props.onTransferClick(entry, transferOptions);
    Actions.invokeAction('HideDirectory');
  };

  useEffect(() => {
    filterDirectory();
  }, [props.entries]);

  return (
    <Flex key="external-directory-tab-list" vertical wrap={false} grow={1} shrink={1}>
      <SearchBox key="key-tab-search-box" onInputChange={onQueueSearchInputChange} inputRef={searchInputRef} />
      <Flex key="external-tab-results" vertical element="TRANSFER_DIR_COMMON_ROWS_CONTAINER">
        {props.isLoading && (
          <Flex hAlignContent="center">
            <Spinner decorative size="sizeIcon90" />
          </Flex>
        )}
        {filteredDirectory.length === 0 && !props.isLoading ? (
          <Alert variant="neutral">
            <Template
              source={
                props.noEntriesMessage && !searchInputRef.current?.value
                  ? props.noEntriesMessage
                  : templates[StringTemplates.NoItemsFound]
              }
            />
          </Alert>
        ) : (
          Array.from(filteredDirectory).map((entry: DirectoryEntry) => {
            return (
              <DirectoryItem
                task={props.task}
                entry={entry}
                key={`dir-item-${entry.type}-${entry.key}`}
                onTransferClick={onTransferEntryClick(entry)}
              />
            );
          })
        )}
      </Flex>
    </Flex>
  );
};

export default withTaskContext(DirectoryTab);
