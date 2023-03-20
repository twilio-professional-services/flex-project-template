import { useState, useEffect } from 'react';
import { Combobox, Button } from '@twilio-paste/core';
import { Manager } from '@twilio/flex-ui';
import { CloseIcon } from '@twilio-paste/icons/esm/CloseIcon';
import { SearchIcon } from '@twilio-paste/icons/esm/SearchIcon';

import { WorkerParticipantInvite, ParticipantInvite } from '../../../../../types/ParticipantInvite';

interface ActivityNameToAvailableFlagMapping {
  [index: string]: boolean;
}
const getActivityNameToAvailableFlagMapping = () => {
  const { workerClient } = Manager.getInstance();

  const activityNameAvailableMapping: ActivityNameToAvailableFlagMapping = {};
  workerClient?.activities.forEach(
    (activity, _) => (activityNameAvailableMapping[activity.name as any] = activity.available),
  );
  return activityNameAvailableMapping; // {offine: false, available: true..... etc
};

const getWorkerDetailsFromSyncObject = (tr_worker: any): WorkerParticipantInvite => {
  return {
    full_name: tr_worker.attributes.full_name,
    activity_name: tr_worker.activity_name,
    worker_sid: tr_worker.worker_sid,
    available: getActivityNameToAvailableFlagMapping()[tr_worker.activity_name],
  };
};

const instantQuery = (search: string, callback: (workers: WorkerParticipantInvite[]) => void) => {
  const syncClient = Manager.getInstance()?.insightsClient;

  syncClient.instantQuery('tr-worker').then((q) => {
    search = search ? search : '';
    q.search(search);

    q.on('searchResult', (items) => {
      const workers: any[] = [];
      Object.entries(items).forEach(([_key, value]) => {
        workers.push(getWorkerDetailsFromSyncObject(value));
      });

      callback(workers);
    });
  });
};

const workerSort = (workerA: WorkerParticipantInvite, workerB: WorkerParticipantInvite): number => {
  // priority is sort on available flag, then activity name, then worker name

  if (workerA.available !== workerB.available)
    if (workerA.available)
      // different available flag status - sort on it
      return -1;
    else return 1;

  if (workerA.activity_name !== workerB.activity_name)
    if (workerA.activity_name.toUpperCase() < workerB.activity_name.toUpperCase())
      // different activity name - sort on it
      return -1;
    else return 1;

  if (workerA.full_name.toUpperCase() < workerB.full_name.toUpperCase()) return -1;
  return 1;
};

interface SelectWorkerToInviteProps {
  updateSelectedParticipant: (selectedParticipant: ParticipantInvite | null) => void;
}
export const SelectWorkerToInvite = ({ updateSelectedParticipant }: SelectWorkerToInviteProps) => {
  const [inputItems, setInputItems] = useState<WorkerParticipantInvite[]>([]);
  const [errorText, setErrorText] = useState<string>('');
  const [inputValue, setInputValue] = useState<string | undefined>('');
  const [selectedWorker, setSelectedWorker] = useState<WorkerParticipantInvite | null>(null);

  const queryResultHandler = (workers: WorkerParticipantInvite[]) => {
    const myWorkerSid = Manager.getInstance().workerClient?.sid;
    workers = workers.filter((worker) => worker.worker_sid !== myWorkerSid); // remove ourseleves from the list
    workers.sort(workerSort);
    setInputItems(workers);
  };

  // fetch workers on mount and input change using sync instant query on tr-worker
  useEffect(() => {
    const fetchData = async () => {
      instantQuery(`data.attributes.full_name contains "${inputValue}"`, queryResultHandler);
    };

    fetchData();
  }, [inputValue]);

  useEffect(() => {
    if (selectedWorker) updateSelectedParticipant({ type: 'Worker', participant: selectedWorker });
    else updateSelectedParticipant(null);
  }, [selectedWorker]);

  const hanldeInputSelectedChange = (selectedItem: WorkerParticipantInvite) => {
    const worker = inputItems.find((item) => item.full_name === selectedItem.full_name) || null;
    if (worker) {
      if (worker.available) {
        setErrorText('');
        setSelectedWorker(worker);
      } else {
        setErrorText('Agent is not in an available activity');
        setSelectedWorker(null);
      }
    } else {
      setSelectedWorker(null);
      setErrorText('');
    }
  };

  return (
    // ideally should follow all of the paste guidelines for useComobox state hook to make this a controlled componet so reset clears state
    // disabled items not yet supported so lets grey out non available agents
    <Combobox
      initialIsOpen
      autocomplete
      groupItemsBy="activity_name"
      items={inputItems}
      labelText="Choose an agent in an available activity:"
      helpText={errorText}
      hasError={Boolean(errorText)}
      optionTemplate={(item) => <div style={item.available ? { opacity: 1 } : { opacity: 0.5 }}>{item.full_name}</div>}
      onInputValueChange={({ inputValue }) => {
        setInputValue(inputValue);
      }}
      onSelectedItemChange={({ selectedItem }) => {
        hanldeInputSelectedChange(selectedItem);
      }}
      itemToString={(item) => (item ? item.full_name : null)}
      insertAfter={
        <Button
          variant="link"
          size="reset"
          onClick={() => {
            setInputValue('');
            setSelectedWorker(null);
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
