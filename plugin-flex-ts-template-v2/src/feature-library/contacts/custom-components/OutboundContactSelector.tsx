import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Box } from '@twilio-paste/core/box';
import { Flex } from '@twilio-paste/core/flex';
import { Stack } from '@twilio-paste/core/stack';
import { Text } from '@twilio-paste/core/text';
import { Select, Option } from '@twilio-paste/core/select';
import { Actions, IconButton, Template, templates } from '@twilio/flex-ui';

import { PhoneNumberItem } from '../../../utils/serverless/PhoneNumbers/PhoneNumberService';
import { Contact } from '../types';
import AppState from '../../../types/manager/AppState';
import { reduxNamespace } from '../../../utils/state';
import { StringTemplates } from '../flex-hooks/strings';

const OutboundContactSelector = () => {
  const myContactList = useSelector((state: AppState) => state[reduxNamespace].contacts.directory);
  const sharedContactList = useSelector((state: AppState) => state[reduxNamespace].contacts.sharedDirectory);

  const placeholder = 'placeholder';

  const [selectOptions, setSelectOptions] = useState([] as PhoneNumberItem[]);
  const [selectedNumber, setSelectedNumber] = useState(placeholder);

  useEffect(() => {
    const options = myContactList
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
      .sort((a: PhoneNumberItem, b: PhoneNumberItem) =>
        a.friendlyName.toLowerCase() > b.friendlyName.toLowerCase() ? 1 : -1,
      );
    setSelectOptions([
      {
        friendlyName: templates[StringTemplates.OutboundContactPlaceholder](),
        phoneNumber: placeholder,
      },
      ...options,
    ]);
  }, [myContactList, sharedContactList]);

  const callContact = () => {
    if (selectedNumber === placeholder) return;
    Actions.invokeAction('StartOutboundCall', {
      destination: selectedNumber,
    });
  };

  return (
    <Box
      borderTopWidth="borderWidth10"
      borderTopColor="colorBorder"
      borderTopStyle="solid"
      marginTop="space80"
      paddingTop="space80"
      width="100%"
    >
      <Stack orientation="vertical" spacing="space60">
        <Text as="span" fontSize="fontSize60" fontWeight="fontWeightBold">
          <Template source={templates[StringTemplates.OutboundContactHeader]} />
        </Text>
        <Select id="outboundContactSelect" value={selectedNumber} onChange={(e) => setSelectedNumber(e.target.value)}>
          {selectOptions.map((item: PhoneNumberItem) => (
            <Option value={item.phoneNumber} disabled={item.phoneNumber === placeholder} key={item.phoneNumber}>
              {item.friendlyName}
            </Option>
          ))}
        </Select>
        <Flex hAlignContent="center">
          <IconButton variant="primary" icon="Call" disabled={selectedNumber === placeholder} onClick={callContact} />
        </Flex>
      </Stack>
    </Box>
  );
};

export default OutboundContactSelector;
