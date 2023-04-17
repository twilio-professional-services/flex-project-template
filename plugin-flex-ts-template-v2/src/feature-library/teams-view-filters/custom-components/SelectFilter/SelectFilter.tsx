import React, { useEffect, useState } from 'react';
import { styled } from '@twilio/flex-ui';
import { Select, Option } from '@twilio-paste/core/select';
import { Stack } from '@twilio-paste/core/stack';
import { useFormPillState, FormPillGroup, FormPill } from '@twilio-paste/core/form-pill-group';

import { FilterDefinitionOption } from '../../types/FilterDefinitionOption';

const FilterContainer = styled('div')`
  margin-left: 16px;
`;

export type OwnProps = {
  handleChange?: (newValue: Array<any> | string) => unknown;
  options?: Array<FilterDefinitionOption>;
  name?: string;
  currentValue?: string[];
  IsMulti: boolean;
};

export const MultiSelectFilter = (props: OwnProps) => {
  const pillState = useFormPillState();
  const [selectedItems, setSelectedItems] = useState([] as string[]);

  useEffect(() => {
    if (props.handleChange) {
      props.handleChange(selectedItems);
    }
  }, [selectedItems]);

  useEffect(() => {
    if (!props.currentValue) {
      setSelectedItems([]);
    }
  }, [props.currentValue]);

  const elementId = `${props.name}-select`;

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!e.target.value) return;

    if (props.IsMulti) {
      setSelectedItems((selectedItems) => [...selectedItems, e.target.value]);
    } else {
      setSelectedItems([e.target.value]);
    }
  };

  const deselectItem = (item: FilterDefinitionOption) => {
    setSelectedItems((selectedItems) => [...selectedItems.filter((i) => i !== item.value)]);
  };

  return (
    <FilterContainer>
      <Stack orientation="vertical" spacing="space30">
        <Select
          id={elementId}
          onChange={handleChange}
          value={props.IsMulti ? 'placeholder' : selectedItems.length === 1 ? selectedItems[0] : 'placeholder'}
        >
          <Option disabled={true} value="placeholder">
            {props.IsMulti ? 'Select one or more items...' : 'Select an item...'}
          </Option>
          {props.options
            ? props.options.map((item: FilterDefinitionOption) => {
                const selectedItem = selectedItems.find((i) => i === item.value);
                if (props.IsMulti && selectedItem) return <></>;
                return (
                  <Option value={item.value} key={item.value}>
                    {item.label}
                  </Option>
                );
              })
            : {}}
        </Select>
        {props.IsMulti && (
          <FormPillGroup {...pillState} aria-label="Selected items:">
            {selectedItems.map((item) => {
              const filterItem = props.options?.find((i) => i.value === item);
              if (!filterItem) return <></>;
              return (
                <FormPill
                  key={filterItem.value}
                  {...pillState}
                  onDismiss={() => {
                    deselectItem(filterItem);
                  }}
                >
                  {filterItem.label}
                </FormPill>
              );
            })}
          </FormPillGroup>
        )}
      </Stack>
    </FilterContainer>
  );
};

export default MultiSelectFilter;
