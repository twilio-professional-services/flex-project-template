import {useState, useEffect} from "react"
import { Combobox, Button} from "@twilio-paste/core"
import { Manager } from "@twilio/flex-ui"
import { CloseIcon } from "@twilio-paste/icons/esm/CloseIcon";
import { SearchIcon } from "@twilio-paste/icons/esm/SearchIcon";


interface ActivityNameToAvailableFlagMapping {
   [index: string]: boolean;
}

const getActivityNameToAvailableFlagMapping = () =>
{
  const workerClient = Manager.getInstance().workerClient;

  const activityNameAvailableMapping : ActivityNameToAvailableFlagMapping = {}
  workerClient?.activities.forEach((activity, _) => activityNameAvailableMapping[activity.name as any] = activity.available)
  return activityNameAvailableMapping; //{offine: false, available: true..... etc
}

interface SyncWorkerDetails {
  full_name: string;
  activity_name: string;
  worker_sid: string;
  available: boolean;
}

const getWorkerDetailsFromSyncObject = (tr_worker: any) : SyncWorkerDetails => {
  return {
    full_name: tr_worker.attributes.full_name,
    activity_name: tr_worker.activity_name,
    worker_sid: tr_worker.worker_sid,
    available: getActivityNameToAvailableFlagMapping()[tr_worker.activity_name]
  }
}

const instantQuery = (search: string, callback: any) => {
  const syncClient = Manager.getInstance()?.insightsClient;

  syncClient.instantQuery('tr-worker').then((q) => {
    console.log("instantQuery", search, q)
    search = search ? search : "";
    q.search(search)
    console.log("instantQuery", search)

    q.on('searchResult', (items) => {
      const workers: any[] = [];
      Object.entries(items).forEach(([key, value]) => {

        workers.push(getWorkerDetailsFromSyncObject(value)
        );
      })
      

      callback(workers);
    })
  })
}

const workerSort = (workerA: SyncWorkerDetails, workerB: SyncWorkerDetails): number => {
  // priority is sort on available flag, then activity name, then worker name

  if (workerA.available !== workerB.available)
    // different available flag status - sort on it
    if (workerA.available)
      return -1
    else
      return 1;

  if (workerA.activity_name !== workerB.activity_name)
    // different activity name - sort on it
    if (workerA.activity_name.toUpperCase() < workerB.activity_name.toUpperCase())
      return -1;
    else
      return 1;

  if (workerA.full_name.toUpperCase() < workerB.full_name.toUpperCase())
    return -1;
  else
    return 1;
}

export const SelectAgentToInvite = () => {
  const [inputItems, setInputItems] = useState<SyncWorkerDetails[]>([]);
  const [errorText, setErrorText] = useState<string>("")
  const [selectedValue, setSelectedValue] = useState<string | undefined>("");
  const [selectedWorker, setSelectedWorker] = useState<SyncWorkerDetails | null>(null)
 
  const queryResultHandler = (workers: SyncWorkerDetails[]) => {
    const myWorkerSid = Manager.getInstance().workerClient?.sid;

    console.log(workers)
    workers = workers.filter(worker => worker.worker_sid !== myWorkerSid) // remove ourseleves from the list
    workers.sort(workerSort)
    setInputItems(workers)
  }
    
  // fetch workers on mount and input change using sync instant query on tr-worker
  useEffect(() => {
    const fetchData = async () => {
      instantQuery(`data.attributes.full_name contains "${selectedValue}"`, queryResultHandler)
    }

    fetchData();
  },
    [selectedValue]);   
  
  const hanldeInputValueChange = (inputValue: string | undefined ) => {
    console.log("hanldeInputValueChange ", inputValue)
    const worker = inputItems.find(item => item.full_name === inputValue) || null;
    console.log("worker?", worker)
    if (worker)
    {
      if (!worker.available)
      {
        setErrorText("Agent is not in an available activity");
        setSelectedWorker(null);
      }
      else
      {
        setErrorText("");
        setSelectedWorker(worker);
      }
        
    }
    else {
      setSelectedWorker(null);
      setErrorText("");
    }

    setSelectedValue(inputValue)
  }
    
  return (
    <Combobox
      autocomplete
      groupItemsBy="activity_name"
      items={inputItems}
      labelText="Choose an agent in an available activity:"
      helpText={errorText}
      hasError={!!errorText}
      optionTemplate={(item) => <div>{item.full_name}</div>}
      onInputValueChange={({ inputValue }) => { hanldeInputValueChange(inputValue) }}
      
      itemToString={item => (item ? item.full_name : null)}
      insertAfter={
          <Button
            variant="link"
            size="reset"
            onClick={() => {
              setSelectedValue('');
             
            }}
          >
          {!!selectedValue ? <CloseIcon decorative={false} title="Clear" />  : <SearchIcon decorative={false} title="Search" />}
          </Button>
        }          
    />
  );
};