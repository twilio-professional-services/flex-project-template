import React from 'react';
import { Input } from '@twilio-paste/core/input';
import { styled } from '@twilio/flex-ui';

const FilterContainer = styled('div')`
  margin-left: 16px;
`;

export type OwnProps = {
  currentValue?: string;
  handleChange?: (newValue: Array<any> | string) => unknown;
  fieldName?: string;
};

export const FreeTextFilter = (props: OwnProps) => {
  const _handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    if (props.handleChange) {
      props.handleChange(e.target.value);
    }
  };

  return (
    <FilterContainer>
      <Input type="text" onChange={_handleChange} name={props.fieldName} value={props.currentValue ?? ''} />
    </FilterContainer>
  );
};

export default FreeTextFilter;
