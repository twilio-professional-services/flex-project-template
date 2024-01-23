/* eslint-disable sonarjs/no-unused-collection */
import { IWorker, Template, Theme, styled, templates } from '@twilio/flex-ui';
import React, { useState, useEffect } from 'react';
import { Flex as FlexBox } from '@twilio-paste/core/flex';
import { Box } from '@twilio-paste/core/box';
import { Button } from '@twilio-paste/core/button';
import { Stack } from '@twilio-paste/core/stack';
import { Table, TBody } from '@twilio-paste/core/table';
import { Switch, SwitchGroup } from '@twilio-paste/core/switch';

import { StringTemplates } from '../../flex-hooks/strings';
import TaskRouterService from '../../../../utils/serverless/TaskRouter/TaskRouterService';
import {
  getTeams,
  getDepartments,
  editTeam,
  editDepartment,
  getTextAttributes,
  getBooleanAttributes,
  isWorkerCanvasTabsEnabled,
} from '../../config';
import AttributeSelect from './AttributeSelect';
import AttributeCustom from './AttributeCustom';

interface OwnProps {
  worker?: IWorker;
}

const WorkerDetailsContainer = ({ worker }: OwnProps) => {
  const [changed, setChanged] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
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
    setIsSaving(true);
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
    setIsSaving(false);
  };

  const SectionHeader = styled('div')`
    flex: 0 0 auto;
    font-size: 0.875rem;
    font-weight: 700;
    line-height: 1.25rem;
    margin: 1.25rem 1rem 0.5rem;
    padding: 0.5rem 0px;
    border-bottom: 1px solid ${(props) => (props.theme as Theme).tokens.borderColors.colorBorderWeak};
    color: ${(props) => (props.theme as Theme).tokens.textColors.colorText};
  `;

  return (
    <Box marginLeft="space30" marginRight="space30">
      <Stack orientation="vertical" spacing="space0">
        {isWorkerCanvasTabsEnabled() ? null : (
          <SectionHeader>
            <Template source={templates[StringTemplates.PSWorkerDetailsContainerName]} />
          </SectionHeader>
        )}
        <Table variant="borderless">
          <TBody>
            <AttributeSelect
              label="Team"
              value={teamName || 'NO_ITEM_SELECTED'}
              options={getTeams()}
              onChangeHandler={handleTeamChange}
              disabled={!editTeam()}
            />
            <AttributeSelect
              label="Department"
              value={departmentName || 'NO_ITEM_SELECTED'}
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
          <FlexBox padding="space30">
            <Box
              width="100%"
              paddingTop="space50"
              borderTopColor="colorBorder"
              borderTopStyle="solid"
              borderTopWidth="borderWidth10"
            >
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
        <FlexBox hAlignContent="right" margin="space30">
          <Stack orientation="horizontal" spacing="space30">
            <Button
              variant="primary"
              id="saveButton"
              onClick={saveWorkerAttributes}
              disabled={!changed}
              loading={isSaving}
            >
              <Template source={templates.Save} />
            </Button>
          </Stack>
        </FlexBox>
      </Stack>
    </Box>
  );
};

export default WorkerDetailsContainer;
