import React, { useState, useEffect } from 'react';
import { Button, Flex, Stack, Table, TBody, Tr, Td, Th } from '@twilio-paste/core';
import { IWorker } from '@twilio/flex-ui';

import TaskRouterService from '../../../../utils/serverless/TaskRouter/TaskRouterService';
import { getTeams, getDepartments, editTeam, editDepartment, editLocation, editManager } from '../../config';
import FormRowText from './FormRowText';
import FormRowSelect from './FormRowSelect';
import FormRowDisplay from './FormRowDisplay';

interface OwnProps {
  worker: IWorker;
}

const UpdateWorkerContainer = ({ worker }: OwnProps) => {
  const [changed, setChanged] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [departmentName, setDepartmentName] = useState('');
  const [location, setLocation] = useState('');
  const [manager, setManager] = useState('');

  useEffect(() => {
    if (worker) {
      setTeamName(worker.attributes.team_name || '');
      setDepartmentName(worker.attributes.department_name || '');
      setLocation(worker.attributes.location || '');
      setManager(worker.attributes.manager || '');
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
            <Th>Name</Th>
            <Td>{worker?.fullName || 'Agent'}</Td>
          </Tr>
          {editTeam() ? (
            <FormRowSelect
              id="team_name"
              label="Team"
              value={teamName}
              options={getTeams()}
              onChangeHandler={handleTeamChange}
            />
          ) : (
            <FormRowDisplay id="team_name" label="Team" value={teamName} />
          )}
          {editDepartment() ? (
            <FormRowSelect
              id="department_name"
              label="Department"
              value={departmentName}
              options={getDepartments()}
              onChangeHandler={handleDeptChange}
            />
          ) : (
            <FormRowDisplay id="department_name" label="Department" value={departmentName} />
          )}
          {editLocation() ? (
            <FormRowText id="location" label="Location" value={location} onChangeHandler={handleLocationChange} />
          ) : (
            <FormRowDisplay id="location" label="Location" value={location} />
          )}
          {editManager() ? (
            <FormRowText id="manager" label="Manager" value={manager} onChangeHandler={handleManagerChange} />
          ) : (
            <FormRowDisplay id="manager" label="Manager" value={manager} />
          )}
        </TBody>
      </Table>
      <Flex hAlignContent="right" margin="space50">
        <Stack orientation="horizontal" spacing="space30">
          <Button variant="primary" id="saveButton" onClick={saveWorkerAttributes} disabled={!changed}>
            Save
          </Button>
        </Stack>
      </Flex>
    </Stack>
  );
};

export default UpdateWorkerContainer;
