import { Actions, ITask } from '@twilio/flex-ui';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Flex } from '@twilio-paste/core/flex';
import { Select, Option } from '@twilio-paste/core/select';

import AppState from '../../../types/manager/AppState';
import { reduxNamespace } from '../../../utils/state';
import { SalesforceIntegrationState } from '../flex-hooks/states';
import TaskRouterService from '../../../utils/serverless/TaskRouter/TaskRouterService';
import logger from '../../../utils/logger';

interface AssociateRecordDropdownProps {
  task?: ITask;
}

const AssociateRecordDropdown = ({ task }: AssociateRecordDropdownProps) => {
  const [isSaving, setIsSaving] = useState(false);

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

    const alreadyBlocked = Actions.findBlockedActions('CompleteTask', { task });
    const shouldBlock = Object.keys(alreadyBlocked).length < 1;

    if (shouldBlock) {
      Actions.blockAction('CompleteTask', { task });
    }
    try {
      setIsSaving(true);
      await TaskRouterService.updateTaskAttributes(task.taskSid, { sfdcObjectId, sfdcObjectType: record.type });
    } catch (error: any) {
      logger.error('[salesforce-integration] Error updating task attributes with record', error);
    } finally {
      setIsSaving(false);
    }
    if (shouldBlock) {
      Actions.unblockAction('CompleteTask', { task });
    }
  };

  return (
    <Flex marginX="space50" marginY="space20">
      <Select
        id="associate-record-select"
        value={task.attributes.sfdcObjectId ?? 'placeholder'}
        onChange={recordSelected}
        disabled={isSaving}
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
