import { IWorker, Template, templates } from '@twilio/flex-ui';
import React, { useState, useEffect } from 'react';
import { Flex as FlexBox } from '@twilio-paste/core/flex';
import { Box } from '@twilio-paste/core/box';
import { Button } from '@twilio-paste/core/button';
import { Label } from '@twilio-paste/core/label';
import { Stack } from '@twilio-paste/core/stack';
import { Table, TBody, Tr, Td } from '@twilio-paste/core/table';
import { Switch, SwitchGroup } from '@twilio-paste/core/switch';
import { Text } from '@twilio-paste/core/text';

import TaskRouterService from '../../../../utils/serverless/TaskRouter/TaskRouterService';
import {
  getTeams,
  getDepartments,
  editTeam,
  editDepartment,
  editLocation,
  editManager,
  editUnitLeader,
  editCoach,
  editSchedule,
  editAutoAccept,
  editAutoWrapup,
} from '../../config';
import AttributeText from './AttributeText';
import AttributeSelect from './AttributeSelect';
import AttributeDisplay from './AttributeDisplay';

const shiftOptions = ['Early', 'Regular', 'Late', 'Night'];

interface OwnProps {
  worker: IWorker;
}

const WorkerDetailsContainer = ({ worker }: OwnProps) => {
  const [changed, setChanged] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [departmentName, setDepartmentName] = useState('');
  const [location, setLocation] = useState('');
  const [manager, setManager] = useState('');
  const [unitLeader, setUnitLeader] = useState(false);
  const [coach, setCoach] = useState(false);
  const [schedule, setSchedule] = useState('');
  const [autoAccept, setAutoAccept] = useState(false);
  const [autoWrapup, setAutoWrapup] = useState(false);

  useEffect(() => {
    if (worker) {
      setTeamName(worker.attributes.team_name || '');
      setDepartmentName(worker.attributes.department_name || '');
      setLocation(worker.attributes.location || '');
      setManager(worker.attributes.manager || '');
      setUnitLeader(worker.attributes.unit_leader || false);
      setCoach(worker.attributes.coach || false);
      setSchedule(worker.attributes.schedule || '');
      setAutoAccept(worker.attributes.auto_accept || false);
      setAutoWrapup(worker.attributes.auto_Wrapup || false);
    }
  }, [worker]);

  const handleLocationChange = (value: string) => {
    if (location !== value) setChanged(true);
    setLocation(value);
  };

  const handleManagerChange = (value: string) => {
    if (manager !== value) setChanged(true);
    setManager(value);
  };

  const handleTeamChange = (team: string) => {
    setChanged(true);
    setTeamName(team);
  };

  const handleDeptChange = (dept: string) => {
    setChanged(true);
    setDepartmentName(dept);
  };

  const handleScheduleChange = (value: string) => {
    setChanged(true);
    setSchedule(value);
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
        location,
        manager,
        unit_leader: unitLeader,
        coach,
        schedule,
        auto_accept: autoAccept,
        auto_wrapup: autoWrapup,
      };
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
          {editTeam() ? (
            <AttributeSelect
              id="team_name"
              label="Team"
              value={teamName}
              options={getTeams()}
              onChangeHandler={handleTeamChange}
            />
          ) : (
            <AttributeDisplay id="team_name" label="Team" value={teamName} />
          )}
          {editDepartment() ? (
            <AttributeSelect
              id="department_name"
              label="Department"
              value={departmentName}
              options={getDepartments()}
              onChangeHandler={handleDeptChange}
            />
          ) : (
            <AttributeDisplay id="department_name" label="Department" value={departmentName} />
          )}
          {editLocation() ? (
            <AttributeText id="location" label="Location" value={location} onChangeHandler={handleLocationChange} />
          ) : (
            <AttributeDisplay id="location" label="Location" value={location} />
          )}
          {editManager() ? (
            <AttributeText id="manager" label="Manager" value={manager} onChangeHandler={handleManagerChange} />
          ) : (
            <AttributeDisplay id="manager" label="Manager" value={manager} />
          )}
          {editSchedule() ? (
            <AttributeSelect
              id="schedule"
              label="Schedule"
              value={schedule}
              options={shiftOptions}
              onChangeHandler={handleScheduleChange}
            />
          ) : (
            <AttributeDisplay id="schedule" label="Schedule" value={schedule} />
          )}
        </TBody>
      </Table>
      <hr />
      <FlexBox>
        <Box width="100%" backgroundColor="colorBackground" padding="space30" margin="space10">
          <SwitchGroup
            name="automation"
            legend={
              <Text as="span" color="currentColor">
                Agent Automation
              </Text>
            }
          >
            <Switch
              value="auto-accept"
              checked={autoAccept}
              disabled={!editAutoAccept()}
              onChange={() => {
                setAutoAccept(!autoAccept);
                setChanged(true);
              }}
            >
              Auto Accept
            </Switch>
            <Switch
              value="auto-wrapup"
              checked={autoWrapup}
              disabled={!editAutoWrapup()}
              onChange={() => {
                setAutoWrapup(!autoWrapup);
                setChanged(true);
              }}
            >
              Auto Accept
            </Switch>
          </SwitchGroup>
        </Box>
        <Box width="100%" backgroundColor="colorBackground" padding="space30" margin="space10">
          <SwitchGroup
            name="permissions"
            legend={
              <Text as="span" color="currentColor">
                Agent permissions
              </Text>
            }
          >
            <Switch
              value="unit-leader"
              checked={unitLeader}
              disabled={!editUnitLeader()}
              onChange={() => {
                setUnitLeader(!unitLeader);
                setChanged(true);
              }}
            >
              Unit Leader
            </Switch>
            <Switch
              value="coac"
              checked={coach}
              disabled={!editCoach()}
              onChange={() => {
                setCoach(!coach);
                setChanged(true);
              }}
            >
              Coach
            </Switch>
          </SwitchGroup>
        </Box>
      </FlexBox>
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
