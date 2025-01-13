import { Manager, templates } from '@twilio/flex-ui';
import { Input } from '@twilio-paste/core/input';
import { SearchIcon } from '@twilio-paste/icons/esm/SearchIcon';
import { Ref } from 'react';

import { StringTemplates } from '../flex-hooks/strings/CustomTransferDirectory';

export interface SearchBoxProps {
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  inputRef?: Ref<HTMLInputElement>;
}

const SearchInput = ({ onInputChange, inputRef }: SearchBoxProps) => {
  const { WorkerDirectorySearchPlaceholder } = Manager.getInstance().strings;

  return (
    <Input
      element="TRANSFER_DIR_COMMON_SEARCH_BOX"
      insertBefore={<SearchIcon decorative={false} title={templates[StringTemplates.SearchDirectory]()} />}
      type="text"
      key="custom-directory-input-field"
      onChange={onInputChange}
      placeholder={WorkerDirectorySearchPlaceholder}
      ref={inputRef}
    />
  );
};

const SearchBox = ({ onInputChange, inputRef }: SearchBoxProps) => {
  return <SearchInput onInputChange={onInputChange} inputRef={inputRef} />;
};

export default SearchBox;
