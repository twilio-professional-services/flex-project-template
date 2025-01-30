import { Alert } from '@twilio-paste/core/alert';
import { Button } from '@twilio-paste/core/button';
import { Flex } from '@twilio-paste/core/flex';
import { Spinner } from '@twilio-paste/core/spinner';
import { LoadingIcon } from '@twilio-paste/icons/esm/LoadingIcon';
import { withTaskContext, ITask, Actions, styled, Template, templates } from '@twilio/flex-ui';
import { useState, useRef, useEffect } from 'react';
import debounce from 'lodash/debounce';

import DirectoryItem from './DirectoryItem';
import SearchBox from './SearchBox';
import { StringTemplates } from '../flex-hooks/strings/CustomTransferDirectory';
import { DirectoryEntry } from '../types/DirectoryEntry';
import { getMaxItems } from '../config';

export interface TransferClickPayload {
  mode: 'WARM' | 'COLD';
}

export interface OwnProps {
  task: ITask;
  entries: Array<DirectoryEntry>;
  isLoading: boolean;
  noEntriesMessage?: string;
  onTransferClick: (entry: DirectoryEntry, transferOptions: TransferClickPayload) => void;
  onReloadClick?: () => void;
}

const SearchRow = styled('div')`
  display: flex;
  align-items: center;
  column-gap: 1rem;
  padding: 1rem;
  padding-top: 1.25rem;
  width: 100%;
`;

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
      <SearchRow key="search-row">
        <SearchBox key="key-tab-search-box" onInputChange={onQueueSearchInputChange} inputRef={searchInputRef} />
        {props.onReloadClick && (
          <Button variant="secondary" onClick={props.onReloadClick}>
            <LoadingIcon decorative={false} title={templates[StringTemplates.UpdateList]()} />
          </Button>
        )}
      </SearchRow>
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
          !props.isLoading &&
          Array.from(filteredDirectory).map((entry, index) => {
            if (index >= getMaxItems()) return null;
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
        {filteredDirectory.length > getMaxItems() && (
          <Alert variant="neutral">
            <Template source={templates[StringTemplates.MoreItems]} />
          </Alert>
        )}
      </Flex>
    </Flex>
  );
};

export default withTaskContext(DirectoryTab);
