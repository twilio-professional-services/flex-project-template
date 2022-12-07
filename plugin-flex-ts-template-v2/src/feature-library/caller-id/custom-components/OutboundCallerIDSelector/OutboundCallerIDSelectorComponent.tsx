import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PhoneNumberItem } from '../../../../utils/serverless/PhoneNumbers/PhoneNumberService';
import { AppState, reduxNamespace } from '../../../../flex-hooks/states'
import { Actions } from '../../flex-hooks/states/OutboundCallerIDSelector';
import { Box } from '@twilio-paste/core/box';
import { HelpText } from '@twilio-paste/core/help-text';
import { Label } from '@twilio-paste/core/label';
import { Select, Option } from '@twilio-paste/core/select';

const OutboundCallerIDSelectorComponent = () => {
  const dispatch = useDispatch();
  
  const {
    isFetchingPhoneNumbers,
    fetchingPhoneNumbersFailed,
    phoneNumbers,
    selectedCallerId
  } = useSelector((state: AppState) => state[reduxNamespace].outboundCallerIdSelector);
  
  const [helpText, setHelpText] = useState("Loading phone numbers...");
  const [selectOptions, setSelectOptions] = useState([] as PhoneNumberItem[]);
  
  useEffect(() => {
    dispatch(Actions.getPhoneNumbers());
  }, []);
  
  useEffect(() => {
    if (isFetchingPhoneNumbers) {
      setSelectOptions([]);
      setHelpText("Loading phone numbers...");
    } else if (fetchingPhoneNumbersFailed) {
      setSelectOptions([]);
      setHelpText("Unable to load phone numbers");
    } else {
      setSelectOptions([
        {
          friendlyName: "Choose a Caller ID",
          phoneNumber: "placeholder"
        },
        ...phoneNumbers
      ]);
      setHelpText('');
      
      // initialize state to the first number, which is what the Select control will display
      if (!selectedCallerId && phoneNumbers.length > 0) {
        dispatch(Actions.setCallerId(phoneNumbers[0].phoneNumber))
      }
    }
  }, [isFetchingPhoneNumbers, fetchingPhoneNumbersFailed])
  
  return (
    <Box width='100%'>
      <Label htmlFor="outboundCallerIdSelect">Caller ID</Label>
      <Select
      id="outboundCallerIdSelect"
      disabled={helpText !== ''}
      value={selectedCallerId}
      onChange={e => dispatch(Actions.setCallerId(e.target.value))}>
        {selectOptions.map((item: PhoneNumberItem) => (
          <Option value={item.phoneNumber} disabled={item.phoneNumber === "placeholder"} key={item.phoneNumber}>
            {item.friendlyName}
          </Option>
        ))}
      </Select>
      {
        helpText && 
        <HelpText>{helpText}</HelpText>
      }
    </Box>
  );
};

export default OutboundCallerIDSelectorComponent;
