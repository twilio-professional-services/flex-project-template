import React from 'react';
import { Manager } from '@twilio/flex-ui';
import { Box } from '@twilio-paste/core/box';
import { Label } from '@twilio-paste/core/label';
import { Select, Option } from '@twilio-paste/core/select';
import { Stack } from '@twilio-paste/core/stack';

import { StringTemplates } from '../../flex-hooks/strings/MassWorkerUpdate';
import { TargetSelection } from '../../types/mass-worker-update';
import { getDepartments, getTeams, getWorkspaceSkillNames } from '../../utils/mass-worker-update';

interface Props {
  selection: TargetSelection;
  disabled?: boolean;
  onChange: (next: TargetSelection) => void;
}

const NONE_VALUE = '';

const TargetSelector: React.FC<Props> = ({ selection, disabled, onChange }) => {
  const strings = Manager.getInstance().strings as any;
  const teams = getTeams();
  const departments = getDepartments();
  const skills = getWorkspaceSkillNames();

  const handleChange = (field: keyof TargetSelection) => (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value === NONE_VALUE ? undefined : event.target.value;
    onChange({ ...selection, [field]: value });
  };

  return (
    <Stack orientation="horizontal" spacing="space60">
      <Box width="240px">
        <Label htmlFor="mwu-team">{strings[StringTemplates.FILTER_TEAM]}</Label>
        <Select id="mwu-team" value={selection.team ?? NONE_VALUE} onChange={handleChange('team')} disabled={disabled}>
          <Option value={NONE_VALUE}>{strings[StringTemplates.NONE]}</Option>
          {teams.map((team) => (
            <Option key={team} value={team}>
              {team}
            </Option>
          ))}
        </Select>
      </Box>
      <Box width="240px">
        <Label htmlFor="mwu-department">{strings[StringTemplates.FILTER_DEPARTMENT]}</Label>
        <Select
          id="mwu-department"
          value={selection.department ?? NONE_VALUE}
          onChange={handleChange('department')}
          disabled={disabled}
        >
          <Option value={NONE_VALUE}>{strings[StringTemplates.NONE]}</Option>
          {departments.map((department) => (
            <Option key={department} value={department}>
              {department}
            </Option>
          ))}
        </Select>
      </Box>
      <Box width="240px">
        <Label htmlFor="mwu-skill">{strings[StringTemplates.FILTER_SKILL]}</Label>
        <Select
          id="mwu-skill"
          value={selection.skill ?? NONE_VALUE}
          onChange={handleChange('skill')}
          disabled={disabled}
        >
          <Option value={NONE_VALUE}>{strings[StringTemplates.NONE]}</Option>
          {skills.map((skill) => (
            <Option key={skill} value={skill}>
              {skill}
            </Option>
          ))}
        </Select>
      </Box>
    </Stack>
  );
};

export default TargetSelector;
