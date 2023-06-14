import React, { useEffect, useState } from 'react';
import { IconButton, Manager, WorkerAttributes, Template, templates } from '@twilio/flex-ui';
import { Box } from '@twilio-paste/core/box';
import { Combobox } from '@twilio-paste/core/combobox';
import { Flex } from '@twilio-paste/core/flex';
import { Stack } from '@twilio-paste/core/stack';
import { Text } from '@twilio-paste/core/text';
import { debounce } from 'lodash';
import { Worker as InstantQueryWorker } from 'types/sync/InstantQuery';

import { makeInternalCall } from '../../helpers/internalCall';
import { StringTemplates } from '../../flex-hooks/strings';

export interface OwnProps {
  manager: Manager;
}

const InternalDialpad = (props: OwnProps) => {
  const [inputText, setInputText] = useState('');
  const [selectedWorker, setSelectedWorker] = useState(null as InstantQueryWorker | null);
  const [workerList, setWorkerList] = useState([] as InstantQueryWorker[]);

  const setWorkers = async (query = '') => {
    if (!props.manager.workerClient) {
      return;
    }
    const { contact_uri: worker_contact_uri } = props.manager.workerClient.attributes as WorkerAttributes;

    const workerQuery = await props.manager.insightsClient.instantQuery('tr-worker');
    workerQuery.on('searchResult', (items: { [key: string]: InstantQueryWorker }) => {
      const initialList = Object.keys(items).map((workerSid: string) => items[workerSid]);
      const availableList = initialList.filter((worker) => worker.activity_name !== 'Offline');
      setWorkerList(availableList);
    });

    const appendQuery = ` AND ${query}`;

    workerQuery.search(`data.attributes.contact_uri != "${worker_contact_uri}"${query === '' ? '' : appendQuery}`);
  };

  useEffect(() => {
    setWorkers();
  }, []);

  const handleWorkersListUpdate = debounce(
    (e) => {
      if (e) {
        setWorkers(`data.attributes.full_name CONTAINS "${e}"`);
      }
    },
    250,
    { maxWait: 1000 },
  );

  useEffect(() => {
    handleWorkersListUpdate(inputText);

    if (selectedWorker && inputText !== selectedWorker.attributes.full_name) {
      setSelectedWorker(null);
    }
  }, [inputText]);

  const selectWorker = (selected: InstantQueryWorker) => {
    setSelectedWorker(selected);
  };

  const handleInput = (inputValue: string) => {
    setInputText(inputValue);
  };

  const handleOpenChange = (isOpen?: boolean) => {
    if (isOpen === true && inputText === '' && workerList.length === 0) {
      setWorkers();
    }
  };

  const makeCall = () => {
    if (selectedWorker !== null) {
      const { manager } = props;

      makeInternalCall(manager, selectedWorker);
    }
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
          <Template source={templates[StringTemplates.CallAgent]} />
        </Text>
        <Combobox
          autocomplete
          items={workerList}
          inputValue={inputText}
          itemToString={(item) => item.attributes.full_name}
          labelText={templates[StringTemplates.SelectAgent]()}
          onInputValueChange={({ inputValue }) => handleInput(inputValue as string)}
          onIsOpenChange={({ isOpen }) => handleOpenChange(isOpen)}
          onSelectedItemChange={({ selectedItem }) => selectWorker(selectedItem)}
          optionTemplate={(item) => <>{item.attributes.full_name}</>}
        />
        <Flex hAlignContent="center">
          <IconButton variant="primary" icon="Call" disabled={!selectedWorker} onClick={makeCall} />
        </Flex>
      </Stack>
    </Box>
  );
};

export default InternalDialpad;
