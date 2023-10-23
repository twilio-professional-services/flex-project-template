/* eslint-disable sonarjs/no-unused-collection */
import { IWorker, Template, templates } from '@twilio/flex-ui';
import React, { useState, useEffect } from 'react';
import { Flex as FlexBox } from '@twilio-paste/core/flex';
import { Box } from '@twilio-paste/core/box';
import { Button } from '@twilio-paste/core/button';
import { Label } from '@twilio-paste/core/label';
import { Stack } from '@twilio-paste/core/stack';
import { Table, TBody, Tr, Td } from '@twilio-paste/core/table';
import { Switch, SwitchGroup } from '@twilio-paste/core/switch';

import TaskRouterService from '../../../../utils/serverless/TaskRouter/TaskRouterService';
import {
  getTeams,
  getDepartments,
  editTeam,
  editDepartment,
  getTextAttributes,
  getBooleanAttributes,
} from '../../config';
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

  const textAttributes = getTextAttributes();
  const booleanAttributes = getBooleanAttributes();

  useEffect(() => {
    if (worker) {
      setTeamName(worker.attributes.team_name || '');
      setDepartmentName(worker.attributes.department_name || '');
      const other = {} as any;
      Object.keys(worker.attributes).forEach((key: string) => {
        if (textAttributes.includes(key)) {
          other[key] = worker.attributes[key];
        }
        if (booleanAttributes.includes(key)) {
          other[key] = worker.attributes[key] || false;
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
          {textAttributes.map((attr) => (
            <AttributeCustom
              key={attr}
              label={attr}
              value={otherAttributes[attr] || ''}
              onChangeHandler={handleOtherChange}
            />
          ))}
        </TBody>
      </Table>
      {booleanAttributes.length > 0 && (
        <FlexBox>
          <Box width="100%" backgroundColor="colorBackground" padding="space30" margin="space10">
            <SwitchGroup name="settings" legend={<Template source={templates.PSWorkerDetailsSettings} />}>
              {booleanAttributes.map((attr) => (
                <Switch
                  key={attr}
                  value={attr}
                  checked={otherAttributes[attr] || false}
                  onChange={() => {
                    setChanged(true);
                    const attributes = { ...otherAttributes, [attr]: !otherAttributes[attr] };
                    setOtherAttributes(attributes);
                  }}
                >
                  {attr}
                </Switch>
              ))}
            </SwitchGroup>
          </Box>
        </FlexBox>
      )}
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
