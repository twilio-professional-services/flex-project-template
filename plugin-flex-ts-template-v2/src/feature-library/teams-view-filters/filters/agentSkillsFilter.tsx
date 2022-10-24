import { FilterDefinition, Manager } from "@twilio/flex-ui";
import SelectFilter from '../custom-components/SelectFilter';
import SelectFilterLabel from '../custom-components/SelectFilterLabel';

const skillsArray = Manager.getInstance().serviceConfiguration.taskrouter_skills?.map(skill => ({
  value: skill.name,
  label: skill.name,
  default: false
}))

/* 
  This filter is based on the skills model thats proposed by Flex

  Its entirely possible a different skills model could be adopted
  in which case this filter would need modified appropriately.

  The filter does an OR'd match on any of the selected skills.
  In other words, if an agent has any of the selected skills
  they will be returned in the search results.
  */

export const agentSkillsFilter = () => ({
  id: 'data.attributes.routing.skills',
  title: 'Agent Skills',
  fieldName: 'skills',
  options: skillsArray? skillsArray : [],
  customStructure: {
    field: <SelectFilter IsMulti={true} />,
    label: <SelectFilterLabel />
  },
  condition: 'IN'
} as FilterDefinition);
