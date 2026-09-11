import React from 'react';
import { Manager } from '@twilio/flex-ui';
import { Box } from '@twilio-paste/core/box';
import { Label } from '@twilio-paste/core/label';
import { Select, Option } from '@twilio-paste/core/select';

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

  // Wrapping flex row: three selects share the row on wide viewports and
  // stack when the total width can no longer fit them. Each field is bounded
  // by `minWidth` (so the select stays legible) and `maxWidth` (so a single
  // select doesn't stretch across the whole row when it's alone on a line).
  const fieldStyle = {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: '200px' as const,
    minWidth: '180px' as const,
    maxWidth: '260px' as const,
  };

  return (
    <Box display="flex" flexWrap="wrap" columnGap="space60" rowGap="space40">
      <Box {...fieldStyle}>
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
      <Box {...fieldStyle}>
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
      <Box {...fieldStyle}>
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
    </Box>
  );
};

export default TargetSelector;
