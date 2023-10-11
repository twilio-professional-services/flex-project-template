import React, { useState, useEffect } from 'react';
import { Button, Flex, Stack, Table, THead, TBody, Th, Tr, Td } from '@twilio-paste/core';
import { IWorker } from '@twilio/flex-ui';

import { getTeams, getDepartments } from '../../config';
import FormRowText from './FormRowText';
import FormRowSelect from './FormRowSelect';

interface OwnProps {
  worker: IWorker;
}

const UpdateWorkerContainer = ({ worker }: OwnProps) => {
  const [changed, setChanged] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [departmentName, setDepartmentName] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    if (worker) {
      setTeamName(worker.attributes.team_name || '');
      setDepartmentName(worker.attributes.department_name || '');
      setLocation(worker.attributes.location || '');
    }
  }, [worker]);

  const handleLocationChange = (value: string) => {
    if (location !== value) setChanged(true);
    setLocation(value);
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
      };
      // Use TaskRouter service to update worker
      // Need new serverless function
    }
  };

  return (
    <Stack orientation="vertical" spacing="space0">
      <Table variant="borderless">
        <THead>
          <Tr>
            <Th> Attribute </Th>
            <Th> Value </Th>
          </Tr>
        </THead>
        <TBody>
          <Tr key="agent_name">
            <Td>Name</Td>
            <Td>{worker?.fullName || 'Agent'}</Td>
          </Tr>
          <FormRowSelect
            id="team_name"
            label="Team"
            value={teamName}
            options={getTeams()}
            onChangeHandler={handleTeamChange}
          />
          <FormRowSelect
            id="department_name"
            label="Dept."
            value={departmentName}
            options={getDepartments()}
            onChangeHandler={handleDeptChange}
          />
          <FormRowText id="location" label="Location" value={location} onChangeHandler={handleLocationChange} />
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
