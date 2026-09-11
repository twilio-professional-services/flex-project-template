import React from 'react';
import { Manager } from '@twilio/flex-ui';
import { Box } from '@twilio-paste/core/box';
import { Checkbox, CheckboxGroup } from '@twilio-paste/core/checkbox';
import { Input } from '@twilio-paste/core/input';
import { Label } from '@twilio-paste/core/label';
import { Stack } from '@twilio-paste/core/stack';
import { Text } from '@twilio-paste/core/text';

import { StringTemplates } from '../../flex-hooks/strings/MassWorkerUpdate';
import { AddSkillMutation, SkillDefinition } from '../../types/mass-worker-update';
import { getWorkspaceSkills, skillHasLevel } from '../../utils/mass-worker-update';

interface Props {
  addSkills: AddSkillMutation[];
  removeSkills: string[];
  disabled?: boolean;
  onChange: (next: { addSkills: AddSkillMutation[]; removeSkills: string[] }) => void;
}

/**
 * Clamps a numeric level to the skill's configured [minimum, maximum] range.
 * Returns `minimum` when the input is empty or non-numeric.
 */
const clampLevel = (raw: string, skill: SkillDefinition): number => {
  const parsed = Number(raw);
  const min = skill.minimum ?? 0;
  const max = skill.maximum ?? Number.MAX_SAFE_INTEGER;
  if (raw === '' || Number.isNaN(parsed)) return min;
  if (parsed < min) return min;
  if (parsed > max) return max;
  return parsed;
};

const SkillMutationPicker: React.FC<Props> = ({ addSkills, removeSkills, disabled, onChange }) => {
  const strings = Manager.getInstance().strings as any;
  const skills = getWorkspaceSkills();

  const findAdd = (skillName: string): AddSkillMutation | undefined =>
    addSkills.find((entry) => entry.name === skillName);

  const handleAddToggle = (skill: SkillDefinition) => (event: React.ChangeEvent<HTMLInputElement>) => {
    let nextAdd: AddSkillMutation[];
    if (event.target.checked) {
      const existing = findAdd(skill.name);
      if (existing) {
        nextAdd = addSkills;
      } else {
        // Default the level to the skill's minimum when it supports levels.
        const level = skillHasLevel(skill) ? (skill.minimum as number) : undefined;
        nextAdd = [...addSkills, { name: skill.name, level }];
      }
    } else {
      nextAdd = addSkills.filter((entry) => entry.name !== skill.name);
    }
    onChange({
      addSkills: nextAdd,
      // Guarantee mutual exclusion: a skill in "add" must not also be in "remove".
      removeSkills: event.target.checked ? removeSkills.filter((s) => s !== skill.name) : removeSkills,
    });
  };

  const handleLevelChange = (skill: SkillDefinition) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const level = clampLevel(event.target.value, skill);
    onChange({
      addSkills: addSkills.map((entry) => (entry.name === skill.name ? { ...entry, level } : entry)),
      removeSkills,
    });
  };

  const handleRemoveToggle = (skill: SkillDefinition) => (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      addSkills: event.target.checked ? addSkills.filter((entry) => entry.name !== skill.name) : addSkills,
      removeSkills: event.target.checked
        ? removeSkills.includes(skill.name)
          ? removeSkills
          : [...removeSkills, skill.name]
        : removeSkills.filter((item) => item !== skill.name),
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

  // Two columns side-by-side on wide viewports, stacked on narrow ones. Each
  // column can shrink below its content width; the parent scroll container
  // (`SectionContent` in the view) handles overflow when the checkbox list
  // is longer than the available height.
  return (
    <Box display="flex" flexWrap="wrap" columnGap="space80" rowGap="space70">
      <Box flexGrow={1} flexShrink={1} flexBasis="260px" minWidth="220px">
        <CheckboxGroup name="mwu-add-skills" legend={strings[StringTemplates.SKILLS_TO_ADD]} disabled={disabled}>
          {skills.map((skill) => {
            const currentAdd = findAdd(skill.name);
            const isChecked = Boolean(currentAdd);
            const hasLevel = skillHasLevel(skill);
            return (
              <Box key={`add-${skill.name}`} paddingBottom="space30">
                <Stack orientation="horizontal" spacing="space40">
                  <Checkbox
                    id={`mwu-add-${skill.name}`}
                    value={skill.name}
                    checked={isChecked}
                    onChange={handleAddToggle(skill)}
                  >
                    {skill.name}
                  </Checkbox>
                  {hasLevel && (
                    <Box display="flex" alignItems="center" columnGap="space30">
                      <Box width="80px">
                        <Input
                          id={`mwu-add-${skill.name}-level`}
                          type="number"
                          aria-label={`${skill.name} level`}
                          min={skill.minimum ?? undefined}
                          max={skill.maximum ?? undefined}
                          value={currentAdd?.level === undefined ? '' : String(currentAdd.level)}
                          onChange={handleLevelChange(skill)}
                          disabled={disabled || !isChecked}
                        />
                      </Box>
                      <Text as="span" color="colorTextWeak" whiteSpace="nowrap">
                        ({skill.minimum}–{skill.maximum})
                      </Text>
                    </Box>
                  )}
                </Stack>
              </Box>
            );
          })}
        </CheckboxGroup>
      </Box>
      <Box flexGrow={1} flexShrink={1} flexBasis="260px" minWidth="220px">
        <CheckboxGroup name="mwu-remove-skills" legend={strings[StringTemplates.SKILLS_TO_REMOVE]} disabled={disabled}>
          {skills.map((skill) => (
            <Checkbox
              key={`remove-${skill.name}`}
              id={`mwu-remove-${skill.name}`}
              value={skill.name}
              checked={removeSkills.includes(skill.name)}
              onChange={handleRemoveToggle(skill)}
            >
              {skill.name}
            </Checkbox>
          ))}
        </CheckboxGroup>
      </Box>
    </Box>
  );
};

export default SkillMutationPicker;
