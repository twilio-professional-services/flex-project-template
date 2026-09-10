import React from 'react';
import { Manager } from '@twilio/flex-ui';
import { Box } from '@twilio-paste/core/box';
import { Checkbox, CheckboxGroup } from '@twilio-paste/core/checkbox';
import { Label } from '@twilio-paste/core/label';
import { Stack } from '@twilio-paste/core/stack';

import { StringTemplates } from '../../flex-hooks/strings/MassWorkerUpdate';
import { getWorkspaceSkillNames } from '../../utils/mass-worker-update';

interface Props {
  addSkills: string[];
  removeSkills: string[];
  disabled?: boolean;
  onChange: (next: { addSkills: string[]; removeSkills: string[] }) => void;
}

const toggle = (list: string[], value: string, checked: boolean): string[] => {
  if (checked) return list.includes(value) ? list : [...list, value];
  return list.filter((item) => item !== value);
};

const SkillMutationPicker: React.FC<Props> = ({ addSkills, removeSkills, disabled, onChange }) => {
  const strings = Manager.getInstance().strings as any;
  const skills = getWorkspaceSkillNames();

  const handleAddChange = (skill: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      addSkills: toggle(addSkills, skill, event.target.checked),
      // Guarantee mutual exclusion: a skill in "add" must not also be in "remove".
      removeSkills: event.target.checked ? removeSkills.filter((s) => s !== skill) : removeSkills,
    });
  };

  const handleRemoveChange = (skill: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      addSkills: event.target.checked ? addSkills.filter((s) => s !== skill) : addSkills,
      removeSkills: toggle(removeSkills, skill, event.target.checked),
    });
  };

  if (skills.length === 0) {
    return (
      <Box paddingY="space40">
        <Label htmlFor="mwu-no-skills">
          No skills are configured in TaskRouter. Deploy skills via flex-config first.
        </Label>
      </Box>
    );
  }

  return (
    <Stack orientation="horizontal" spacing="space80">
      <Box>
        <CheckboxGroup name="mwu-add-skills" legend={strings[StringTemplates.SKILLS_TO_ADD]} disabled={disabled}>
          {skills.map((skill) => (
            <Checkbox
              key={`add-${skill}`}
              id={`mwu-add-${skill}`}
              value={skill}
              checked={addSkills.includes(skill)}
              onChange={handleAddChange(skill)}
            >
              {skill}
            </Checkbox>
          ))}
        </CheckboxGroup>
      </Box>
      <Box>
        <CheckboxGroup name="mwu-remove-skills" legend={strings[StringTemplates.SKILLS_TO_REMOVE]} disabled={disabled}>
          {skills.map((skill) => (
            <Checkbox
              key={`remove-${skill}`}
              id={`mwu-remove-${skill}`}
              value={skill}
              checked={removeSkills.includes(skill)}
              onChange={handleRemoveChange(skill)}
            >
              {skill}
            </Checkbox>
          ))}
        </CheckboxGroup>
      </Box>
    </Stack>
  );
};

export default SkillMutationPicker;
