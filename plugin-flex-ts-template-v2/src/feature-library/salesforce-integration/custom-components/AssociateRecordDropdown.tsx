import { ITask } from '@twilio/flex-ui';
import { useSelector } from 'react-redux';
import { Flex } from '@twilio-paste/core/flex';
import { Select, Option } from '@twilio-paste/core/select';

import AppState from '../../../types/manager/AppState';
import { reduxNamespace } from '../../../utils/state';
import { SalesforceIntegrationState } from '../flex-hooks/states';
import TaskRouterService from '../../../utils/serverless/TaskRouter/TaskRouterService';

interface AssociateRecordDropdownProps {
  task?: ITask;
}

const AssociateRecordDropdown = ({ task }: AssociateRecordDropdownProps) => {
  const { screenPopSearchResults } = useSelector(
    (state: AppState) => state[reduxNamespace].salesforceIntegration as SalesforceIntegrationState,
  );

  if (!task || !screenPopSearchResults[task.sid]) {
    return <></>;
  }

  const recordSelected = async (e: any) => {
    const sfdcObjectId = e.target.value;

    if (sfdcObjectId === 'placeholder') {
      return;
    }

    const record = screenPopSearchResults[task.sid].find((item) => item.id === sfdcObjectId);

    if (!record) {
      return;
    }

    await TaskRouterService.updateTaskAttributes(task.taskSid, { sfdcObjectId, sfdcObjectType: record.type });
  };

  return (
    <Flex marginX="space50" marginY="space20">
      <Select
        id="associate-record-select"
        value={task.attributes.sfdcObjectId ?? 'placeholder'}
        onChange={recordSelected}
      >
        <Option disabled value="placeholder">
          Select a record to associate...
        </Option>
        {screenPopSearchResults[task.sid].map((result) => (
          <Option value={result.id}>
            {result.name} - {result.type}
          </Option>
        ))}
      </Select>
    </Flex>
  );
};

export default AssociateRecordDropdown;
