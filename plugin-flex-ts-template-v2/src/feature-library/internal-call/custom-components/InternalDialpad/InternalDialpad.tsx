import React, { useEffect, useState } from 'react';
import { IconButton, Manager, WorkerAttributes, Template, templates } from '@twilio/flex-ui';
import { Box } from '@twilio-paste/core/box';
import { Combobox } from '@twilio-paste/core/combobox';
import { Flex } from '@twilio-paste/core/flex';
import { Stack } from '@twilio-paste/core/stack';
import { Tabs, TabList, Tab, TabPanels, TabPanel } from '@twilio-paste/core/tabs';
import { useUID } from '@twilio-paste/core/uid-library';
import debounce from 'lodash/debounce';

import { Worker as InstantQueryWorker, Queue as InstantQueryQueue } from '../../../../types/sync/InstantQuery';
import { isCallAgentEnabled, isCallQueueEnabled } from '../../config';
import { makeInternalCall, makeInternalCallToQueue } from '../../helpers/internalCall';
import { StringTemplates } from '../../flex-hooks/strings';

export interface OwnProps {
  manager: Manager;
}

const InternalDialpad = (props: OwnProps) => {
  const [inputText, setInputText] = useState('');
  const [inputTextQueue, setInputTextQueue] = useState('');
  const [selectedWorker, setSelectedWorker] = useState(null as InstantQueryWorker | null);
  const [selectedQueue, setSelectedQueue] = useState(null as InstantQueryQueue | null);
  const [workerList, setWorkerList] = useState([] as InstantQueryWorker[]);
  const [queueList, setQueueList] = useState([] as InstantQueryQueue[]);
  const [initialQueueList, setInitialQueueList] = useState([] as InstantQueryQueue[]);

  const setWorkers = async (query = '') => {
    if (!props.manager.workerClient) {
      return;
    }
    const { contact_uri: worker_contact_uri } = props.manager.workerClient.attributes as WorkerAttributes;
    const { taskrouter_offline_activity_sid } = props.manager.serviceConfiguration;

    const workerQuery = await props.manager.insightsClient.instantQuery('tr-worker');
    workerQuery.on('searchResult', (items: { [key: string]: InstantQueryWorker }) => {
      const initialList = Object.keys(items).map((workerSid: string) => items[workerSid]);
      const availableList = initialList.filter(
        (worker) => worker.worker_activity_sid !== taskrouter_offline_activity_sid,
      );
      setWorkerList(availableList);
    });

    const appendQuery = ` AND ${query}`;

    workerQuery.search(`data.attributes.contact_uri != "${worker_contact_uri}"${query === '' ? '' : appendQuery}`);
  };

  const setQueues = async (query = '') => {
    if (!props.manager.workerClient) {
      return;
    }
    const queueQuery = await props.manager.insightsClient.instantQuery('tr-queue');
    queueQuery.on('searchResult', (items: { [key: string]: InstantQueryQueue }) => {
      const initialList = Object.keys(items).map((queueSid: string) => items[queueSid]);
      setQueueList(initialList.sort((a: any, b: any) => (a.queue_name < b.queue_name ? -1 : 1)));
      setInitialQueueList(initialList);
    });
    queueQuery.search(query);
  };

  useEffect(() => {
    setWorkers();
    setQueues();
  }, []);

  const handleWorkersListUpdate = debounce(
    (e) => {
      if (e) {
        setWorkers(`(data.attributes.full_name CONTAINS "${e}" OR data.friendly_name CONTAINS "${e}")`);
      }
    },
    250,
    { maxWait: 1000 },
  );

  const handleQueueListUpdate = debounce(
    (e) => {
      if (e) {
        setQueues(`(data.queue_name CONTAINS "${e}" OR data.name CONTAINS "${e}")`);
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

  useEffect(() => {
    handleQueueListUpdate(inputText);

    if (selectedQueue && inputTextQueue !== selectedQueue.queue_name) {
      setSelectedQueue(null);
    }
  }, [inputTextQueue]);

  const selectWorker = (selected: InstantQueryWorker) => {
    setSelectedWorker(selected);
  };

  const selectQueue = (selected: InstantQueryQueue) => {
    setSelectedQueue(selected);
  };

  const handleAgentInput = (inputValue: string) => {
    setInputText(inputValue);
  };

  const handleInputQueue = (inputValue: string) => {
    setQueueList(
      initialQueueList.filter((item: InstantQueryQueue) =>
        item.queue_name.toLocaleLowerCase().startsWith(inputValue.toLocaleLowerCase()),
      ),
    );
    setInputTextQueue(inputValue);
  };

  const handleOpenChange = (isOpen?: boolean) => {
    if (isOpen === true && inputText === '' && workerList.length === 0) {
      setWorkers();
    }
  };

  const handleOpenChangeQueue = (isOpen?: boolean) => {
    if (isOpen === true && inputTextQueue === '' && queueList.length === 0) {
      setQueues();
    }
  };

  const makeCallToAgent = () => {
    if (selectedWorker !== null) {
      const { manager } = props;

      makeInternalCall(manager, selectedWorker);
    }
  };

  const makeCallToQueue = () => {
    if (selectedQueue !== null) {
      const { manager } = props;
      makeInternalCallToQueue(manager, selectedQueue);
    }
  };

  const agentCallId = useUID();
  const queueCallId = useUID();
  const selectedId = isCallAgentEnabled() ? agentCallId : isCallQueueEnabled() ? queueCallId : agentCallId;

  return (
    <Box marginTop="space80" paddingBottom="space200" width="100%">
      <Tabs selectedId={selectedId} baseId="internal-call-tabs">
        <TabList aria-label="Internal call tabs">
          {isCallAgentEnabled() && (
            <Tab id={agentCallId}>
              <Template code={StringTemplates.CallAgent} />
            </Tab>
          )}
          {isCallQueueEnabled() && (
            <Tab id={queueCallId}>
              <Template code={StringTemplates.CallQueue} />
            </Tab>
          )}
        </TabList>
        <TabPanels>
          {isCallAgentEnabled() && (
            <TabPanel>
              <Stack orientation="vertical" spacing="space60">
                <Combobox
                  autocomplete
                  items={workerList}
                  inputValue={inputText}
                  itemToString={(item) => item.attributes.full_name || item.friendly_name}
                  labelText={templates[StringTemplates.SelectAgent]()}
                  onInputValueChange={({ inputValue }) => handleAgentInput(inputValue as string)}
                  onIsOpenChange={({ isOpen }) => handleOpenChange(isOpen)}
                  onSelectedItemChange={({ selectedItem }) => selectWorker(selectedItem)}
                  optionTemplate={(item) => <>{item.attributes.full_name || item.friendly_name}</>}
                />
                <Flex hAlignContent="center">
                  <IconButton variant="primary" icon="Call" disabled={!selectedWorker} onClick={makeCallToAgent} />
                </Flex>
              </Stack>
            </TabPanel>
          )}
          {isCallQueueEnabled() && (
            <TabPanel>
              <Stack orientation="vertical" spacing="space60">
                <Combobox
                  autocomplete
                  items={queueList}
                  inputValue={inputTextQueue}
                  itemToString={(item) => item.queue_name || null}
                  labelText={templates[StringTemplates.SelectQueue]()}
                  onInputValueChange={({ inputValue }) => handleInputQueue(inputValue as string)}
                  onIsOpenChange={({ isOpen }) => handleOpenChangeQueue(isOpen)}
                  onSelectedItemChange={({ selectedItem }) => selectQueue(selectedItem)}
                  optionTemplate={(item) => <>{item.queue_name || null}</>}
                />
                <Flex hAlignContent="center">
                  <IconButton variant="primary" icon="Call" disabled={!selectedQueue} onClick={makeCallToQueue} />
                </Flex>
              </Stack>
            </TabPanel>
          )}
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default InternalDialpad;
