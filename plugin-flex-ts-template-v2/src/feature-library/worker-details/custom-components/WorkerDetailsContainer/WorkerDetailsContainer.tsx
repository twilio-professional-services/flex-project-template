/* eslint-disable sonarjs/no-unused-collection */
import { IWorker, Template, templates } from '@twilio/flex-ui';
import React, { useState, useEffect } from 'react';
import { Flex as FlexBox } from '@twilio-paste/core/flex';
import { Button } from '@twilio-paste/core/button';
import { Label } from '@twilio-paste/core/label';
import { Stack } from '@twilio-paste/core/stack';
import { Table, TBody, Tr, Td } from '@twilio-paste/core/table';

import TaskRouterService from '../../../../utils/serverless/TaskRouter/TaskRouterService';
import { getTeams, getDepartments, editTeam, editDepartment, getCustomAttributes } from '../../config';
import AttributeSelect from './AttributeSelect';
import AttributeCustom from './AttributeCustom';

interface OwnProps {
  worker: IWorker;
}

const WorkerDetailsContainer = ({ worker }: OwnProps) => {
  const [changed, setChanged] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [departmentName, setDepartmentName] = useState('');
  const [otherAttributes, setOtherAttributes] = useState({} as any);

  const attributeNames = getCustomAttributes();
  useEffect(() => {
    if (worker) {
      setTeamName(worker.attributes.team_name || '');
      setDepartmentName(worker.attributes.department_name || '');
      const other = {} as any;
      Object.keys(worker.attributes).forEach((key: string) => {
        if (attributeNames.includes(key)) {
          other[key] = worker.attributes[key];
        }
      });

      setOtherAttributes(other);
    }
  }, [worker]);

  const handleTeamChange = (team: string) => {
    setChanged(true);
    setTeamName(team);
  };

  const handleDeptChange = (dept: string) => {
    setChanged(true);
    setDepartmentName(dept);
  };

  const handleOtherChange = (key: string, value: string) => {
    setChanged(true);
    const attributes = { ...otherAttributes, [key]: value };
    setOtherAttributes(attributes);
  };

  // See the notes in our Flex insights docs
  // https://www.twilio.com/docs/flex/developer/insights/enhance-integration
  //    The team_id attribute is required to display team_name.
  //    The department_id attribute is required to display department_name.
  //
  // Because of the above it's easier to simply set team_id/name to the same values
  // and similarly to set department_id/name to the same values

  const saveWorkerAttributes = async () => {
    const workerSid = worker && worker.sid;
    // Only save if worker was selected
    if (workerSid) {
      const updatedAttr = {
        team_id: teamName,
        team_name: teamName,
        department_id: departmentName,
        department_name: departmentName,
        ...otherAttributes,
      } as any;
      await TaskRouterService.updateWorkerAttributes(workerSid, JSON.stringify(updatedAttr));
      setChanged(false);
    }
  };

  return (
    <Stack orientation="vertical" spacing="space0">
      <Table variant="borderless">
        <TBody>
          <Tr key="agent_name">
            <Td element="WORKER_DETAILS">
              <Label htmlFor="name">
                <Template source={templates.PSWorkerDetailsName} />
              </Label>
            </Td>
            <Td element="WORKER_DETAILS">{worker?.fullName || 'Agent'}</Td>
          </Tr>
          <AttributeSelect
            label="Team"
            value={teamName}
            options={getTeams()}
            onChangeHandler={handleTeamChange}
            disabled={!editTeam()}
          />
          <AttributeSelect
            label="Department"
            value={departmentName}
            options={getDepartments()}
            onChangeHandler={handleDeptChange}
            disabled={!editDepartment()}
          />
          {attributeNames.map((attr) => (
            <AttributeCustom
              key={attr}
              label={attr}
              value={otherAttributes[attr] || ''}
              onChangeHandler={handleOtherChange}
            />
          ))}
        </TBody>
      </Table>
      <FlexBox hAlignContent="right" margin="space50">
        <Stack orientation="horizontal" spacing="space30">
          <Button variant="primary" id="saveButton" onClick={saveWorkerAttributes} disabled={!changed}>
            <Template source={templates.Save} />
          </Button>
        </Stack>
      </FlexBox>
    </Stack>
  );
};

export default WorkerDetailsContainer;
