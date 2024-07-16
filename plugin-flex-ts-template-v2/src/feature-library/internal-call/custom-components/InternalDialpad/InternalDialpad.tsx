import React, { useEffect, useState } from 'react';
import { IconButton, Manager, WorkerAttributes, Template, templates, IQueue } from '@twilio/flex-ui';
import { Box } from '@twilio-paste/core/box';
import { Combobox, useCombobox } from '@twilio-paste/core/combobox';
import { Flex } from '@twilio-paste/core/flex';
import { Stack } from '@twilio-paste/core/stack';
import { Tabs, TabList, Tab, TabPanels, TabPanel } from '@twilio-paste/core/tabs';
import { useUID } from '@twilio-paste/core/uid-library';
import debounce from 'lodash/debounce';

import { Worker as InstantQueryWorker } from '../../../../types/sync/InstantQuery';
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
  const [selectedQueue, setSelectedQueue] = useState(null as IQueue | null);
  const [canLoadWorkers, setCanLoadWorkers] = useState(false);
  const [workerList, setWorkerList] = useState([] as InstantQueryWorker[]);
  const [queueList, setQueueList] = useState([] as IQueue[]);
  const [initialQueueList, setInitialQueueList] = useState([] as IQueue[]);
  const { workspaceClient } = Manager.getInstance();

  const {
    selectItem: queueComboboxSelectItem,
    setInputValue: queueComboboxSetInputValue,
    ...queueComboboxState
  } = useCombobox({
    items: queueList,
    inputValue: inputTextQueue,
    itemToString: (item) => item?.name || '',
    onInputValueChange: ({ inputValue }) => setInputTextQueue(inputValue as string),
    onIsOpenChange: ({ isOpen }) => handleOpenChangeQueue(isOpen),
    onSelectedItemChange: ({ selectedItem }) => setSelectedQueue(selectedItem || null),
  });

  const setWorkers = async (query = '') => {
    if (!canLoadWorkers || !props.manager.workerClient) {
      // canLoadWorkers is in place so that we wait until the user has opened the combobox before loading the workers list.
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

  // async function to retrieve the task queues from the tr sdk
  // this will trigger the useEffect for a initialQueueList update
  const setQueues = async () => {
    if (!workspaceClient) {
      return;
    }
    setInitialQueueList(
      Array.from(
        (
          await workspaceClient.fetchTaskQueues({
            Ordering: 'DateUpdated:desc',
          })
        ).values(),
      ).sort((a, b) => (a.name > b.name ? 1 : -1)) as unknown as Array<IQueue>,
    );
  };

  const handleWorkersListUpdate = debounce(
    (e) => {
      setWorkers(e ? `(data.attributes.full_name CONTAINS "${e}" OR data.friendly_name CONTAINS "${e}")` : '');
    },
    250,
    { maxWait: 1000 },
  );

  const handleQueueListUpdate = () => {
    setQueueList(
      inputTextQueue
        ? initialQueueList.filter((item: IQueue) =>
            item.name.toLocaleLowerCase().startsWith(inputTextQueue.toLocaleLowerCase()),
          )
        : initialQueueList,
    );
  };

  useEffect(() => {
    setWorkers();
  }, [canLoadWorkers]);

  useEffect(() => {
    handleQueueListUpdate();
  }, [initialQueueList]);

  useEffect(() => {
    handleWorkersListUpdate(inputText);

    if (selectedWorker && inputText !== selectedWorker.attributes.full_name) {
      setSelectedWorker(null);
    }
  }, [inputText]);

  useEffect(() => {
    handleQueueListUpdate();

    if (selectedQueue && inputTextQueue !== selectedQueue.name) {
      setSelectedQueue(null);
      // Manually reset Paste combobox state to match our state.
      queueComboboxSelectItem(null as any);
      queueComboboxSetInputValue(inputTextQueue);
    }
  }, [inputTextQueue]);

  const handleOpenChange = (isOpen?: boolean) => {
    if (isOpen === true && inputText === '' && workerList.length === 0) {
      setCanLoadWorkers(true);
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
                  onInputValueChange={({ inputValue }) => setInputText(inputValue as string)}
                  onIsOpenChange={({ isOpen }) => handleOpenChange(isOpen)}
                  onSelectedItemChange={({ selectedItem }) => setSelectedWorker(selectedItem)}
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
                  labelText={templates[StringTemplates.SelectQueue]()}
                  optionTemplate={(item) => <>{item.name}</>}
                  state={{ ...queueComboboxState }}
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
