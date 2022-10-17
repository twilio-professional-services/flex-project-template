import React, { useRef } from 'react';
import { styled } from '@twilio/flex-ui';
import Select from 'react-select'; // TODO: When Flex adopts a newer version of Paste we can use that instead and uninstall react-select.

import { FilterDefinitionOption } from "../../types/FilterDefinitionOption";

// Setting height to the max allowed for any individual filter
// to provide as much room as possible to the options list
const FilterContainer = styled('div')`
  height: 220px;
  margin-left: 16px;
  margin-right: 16px;
`;

export type OwnProps = {
  handleChange?: (newValue: Array<any> | string) => {};
  options?: Array<FilterDefinitionOption>;
  name?: string;
  currentValue?: string[];
  IsMulti: boolean;
}

export const MultiSelectFilter = (props: OwnProps) => {
  const selectRef = useRef<any>(null);
  
  if (!props.currentValue && selectRef && selectRef.current) {
    selectRef.current.setValue([]);
  }
  
  const elementId = `${props.name}-select`;
  
  const selectStyles = {
    // Setting maxHeight to 53 to ensure the input field only expands
    // to two lines. If it grows beyond two lines, it will push the
    // menu list outside of the div and requiring scrolling the containing
    // div as well as the menu list itself to see all the options, which
    // could be confusing for the user
    valueContainer: (provided: any) => ({
      ...provided,
      maxHeight: 50,
      overflow: 'auto',
    }),
    control: (provided: any) => ({
      ...provided,
      borderRadius: 0,
      maxHeight: 53
    }),
    // Setting maxHeight to 150px to ensure that its height along with
    // the input container's height at two lines of selected options
    // doesn't exceed the height of the containing div
    menuList: (provided: any) => ({
      ...provided,
      maxHeight: '150px',
    }),
    menu: (provided: any) => ({
      ...provided,
      borderRadius: 0,
    })
  };
  
  const _handleChange = (e: any, v: any) => {
    var newValue;

    if(props.IsMulti) {
      newValue = Array.isArray(e) ? e.map(o => o.value) : [];
    } else {
      newValue = Array.isArray(e) ? e.map(o => o.value) : [e.value];
    }
    
    if (props.handleChange) {
      props.handleChange(newValue);
    }
    
    const valueContainer = document.querySelector(`.${props.name}__value-container`);
    // Without setting scrollTop, the most recently selected option can be hidden
    // until the user manually scrolls to the bottom of the value containers
    if (valueContainer) {
      valueContainer.scrollTop = valueContainer.scrollHeight - valueContainer.clientHeight;
    }
  }
  
  return (
    <FilterContainer>
      <Select
        classNamePrefix={props.name}
        id={elementId}
        ref={selectRef}
        isMulti={props.IsMulti}
        name={props.name}
        options={props.options}
        onChange={_handleChange}
        styles={selectStyles}
      />
    </FilterContainer>
  )
};

export default MultiSelectFilter;
