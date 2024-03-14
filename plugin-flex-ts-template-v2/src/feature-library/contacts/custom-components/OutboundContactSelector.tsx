import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Box } from '@twilio-paste/core/box';
import { Flex } from '@twilio-paste/core/flex';
import { Stack } from '@twilio-paste/core/stack';
import { Text } from '@twilio-paste/core/text';
import { Combobox } from '@twilio-paste/core/combobox';
import { Actions, IconButton, Template, templates } from '@twilio/flex-ui';

import { PhoneNumberItem } from '../../../utils/serverless/PhoneNumbers/PhoneNumberService';
import { Contact } from '../types';
import AppState from '../../../types/manager/AppState';
import { reduxNamespace } from '../../../utils/state';
import { StringTemplates } from '../flex-hooks/strings';

const OutboundContactSelector = () => {
  const myContactList = useSelector((state: AppState) => state[reduxNamespace].contacts.directory);
  const sharedContactList = useSelector((state: AppState) => state[reduxNamespace].contacts.sharedDirectory);

  const [selectOptions, setSelectOptions] = useState([] as PhoneNumberItem[]);
  const [selectedNumber, setSelectedNumber] = useState(null as PhoneNumberItem | null);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const inputValueLower = inputValue.toLowerCase();
    setSelectOptions(
      myContactList
        .map((contact: Contact) => ({
          friendlyName: contact.name,
          phoneNumber: contact.phoneNumber,
        }))
        .concat(
          sharedContactList.map((contact: Contact) => ({
            friendlyName: contact.name,
            phoneNumber: contact.phoneNumber,
          })),
        )
        .filter(
          (item: PhoneNumberItem) => !Boolean(inputValue) || item.friendlyName.toLowerCase().includes(inputValueLower),
        )
        .sort((a: PhoneNumberItem, b: PhoneNumberItem) =>
          a.friendlyName.toLowerCase() > b.friendlyName.toLowerCase() ? 1 : -1,
        ),
    );
  }, [inputValue, myContactList, sharedContactList]);

  useEffect(() => {
    if (selectedNumber?.friendlyName !== inputValue) {
      setSelectedNumber(null);
    }
  }, [inputValue]);

  const callContact = () => {
    if (!selectedNumber) return;
    Actions.invokeAction('StartOutboundCall', {
      destination: selectedNumber.phoneNumber,
    });
  };

  return (
    <Box
      borderTopWidth="borderWidth10"
      borderTopColor="colorBorder"
      borderTopStyle="solid"
      marginTop="space80"
      paddingTop="space80"
      paddingBottom="space200"
      width="100%"
    >
      <Stack orientation="vertical" spacing="space60">
        <Text as="span" fontSize="fontSize60" fontWeight="fontWeightBold">
          <Template source={templates[StringTemplates.OutboundContactHeader]} />
        </Text>
        <Combobox
          autocomplete
          items={selectOptions}
          inputValue={inputValue}
          itemToString={(item) => item.friendlyName}
          labelText={templates[StringTemplates.OutboundContactLabel]()}
          onInputValueChange={({ inputValue }) => setInputValue(inputValue as string)}
          onSelectedItemChange={({ selectedItem }) => setSelectedNumber(selectedItem)}
          optionTemplate={(item) => (
            <Stack orientation="vertical" spacing="space0">
              <Text as="p">{item.friendlyName}</Text>
              <Text as="p" color="colorTextWeak" fontSize="fontSize20">
                {item.phoneNumber}
              </Text>
            </Stack>
          )}
        />
        <Flex hAlignContent="center">
          <IconButton variant="primary" icon="Call" disabled={!Boolean(selectedNumber)} onClick={callContact} />
        </Flex>
      </Stack>
    </Box>
  );
};

export default OutboundContactSelector;
