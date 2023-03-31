import { useState, useEffect } from 'react';
import { Combobox, Button } from '@twilio-paste/core';
import { Manager } from '@twilio/flex-ui';
import { CloseIcon } from '@twilio-paste/icons/esm/CloseIcon';
import { SearchIcon } from '@twilio-paste/icons/esm/SearchIcon';

import { QueueParticipantInvite, ParticipantInvite } from '../../../../../types/ParticipantInvite';

const getQueueDetailsFromSyncObject = (tr_queue: any): QueueParticipantInvite => {
  return {
    queue_name: tr_queue.queue_name,
    queue_sid: tr_queue.queue_sid,
  };
};

const instantQuery = (search: string, callback: (workers: QueueParticipantInvite[]) => void) => {
  const syncClient = Manager.getInstance()?.insightsClient;

  syncClient.instantQuery('tr-queue').then((q) => {
    search = search ? search : '';
    q.search(search);

    q.on('searchResult', (items) => {
      const queues: any[] = [];
      Object.entries(items).forEach(([_key, value]) => {
        queues.push(getQueueDetailsFromSyncObject(value));
      });
      callback(queues);
    });
  });
};

const queueSort = (queueA: QueueParticipantInvite, queueB: QueueParticipantInvite): number => {
  if (queueA.queue_name.toUpperCase() < queueB.queue_name.toUpperCase()) return -1;
  return 1;
};

interface SelectQueueToInviteProps {
  updateSelectedParticipant: (selectedParticipant: ParticipantInvite | null) => void;
}
export const SelectQueueToInvite = ({ updateSelectedParticipant }: SelectQueueToInviteProps) => {
  const [inputItems, setInputItems] = useState<QueueParticipantInvite[]>([]);
  const [inputValue, setInputValue] = useState<string | undefined>('');
  const [selectedQueue, setSelectedQueue] = useState<QueueParticipantInvite | null>(null);

  const queryResultHandler = (queues: QueueParticipantInvite[]) => {
    queues.sort(queueSort);
    setInputItems(queues);
  };

  // fetch queue on mount and input change using sync instant query on tr-queue
  useEffect(() => {
    const fetchData = async () => {
      instantQuery(`data.queue_name contains "${inputValue}"`, queryResultHandler);
    };

    fetchData();
  }, [inputValue]);

  useEffect(() => {
    if (selectedQueue) updateSelectedParticipant({ type: 'Queue', participant: selectedQueue });
    else updateSelectedParticipant(null);
  }, [selectedQueue]);

  const hanldeInputSelectedChange = (selectedItem: QueueParticipantInvite) => {
    const queue = inputItems.find((item) => item.queue_name === selectedItem.queue_name) || null;
    if (queue) {
      setSelectedQueue(queue);
    } else {
      setSelectedQueue(null);
    }
  };

  return (
    // ideally should follow all of the paste guidelines for useComobox state hook to make this a controlled component so reset clears state
    // disabled items not yet supported so lets grey out non available agents
    <Combobox
      initialIsOpen
      autocomplete
      items={inputItems}
      labelText="Choose a queue:"
      optionTemplate={(item) => <div>{item.queue_name}</div>}
      onInputValueChange={({ inputValue }) => {
        setInputValue(inputValue);
      }}
      onSelectedItemChange={({ selectedItem }) => {
        hanldeInputSelectedChange(selectedItem);
      }}
      itemToString={(item) => (item ? item.queue_name : null)}
      insertAfter={
        <Button
          variant="link"
          size="reset"
          onClick={() => {
            setInputValue('');
            setSelectedQueue(null);
          }}
        >
          {inputValue ? (
            <CloseIcon decorative={false} title="Clear" />
          ) : (
            <SearchIcon decorative={false} title="Search" />
          )}
        </Button>
      }
    />
  );
};
