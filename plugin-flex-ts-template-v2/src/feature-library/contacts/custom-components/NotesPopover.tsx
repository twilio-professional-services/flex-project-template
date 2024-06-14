import { Template, templates } from '@twilio/flex-ui';
import { NotesIcon } from '@twilio-paste/icons/esm/NotesIcon';
import { PopoverContainer, PopoverButton, Popover } from '@twilio-paste/core/popover';
import { Text } from '@twilio-paste/core/text';
import { Heading } from '@twilio-paste/core/heading';

import { StringTemplates } from '../flex-hooks/strings';

interface Props {
  notes: string;
}

const NotesPopover = ({ notes }: Props) => {
  return (
    <PopoverContainer baseId="notes">
      <PopoverButton variant="primary_icon" disabled={!notes} size="icon_small">
        <NotesIcon decorative={false} title={templates[StringTemplates.ContactNotes]()} />
      </PopoverButton>
      <Popover aria-label="Popover">
        <Heading as="h3" variant="heading30">
          <Template source={templates[StringTemplates.ContactNotes]} />
        </Heading>
        <Text as="p">{notes}</Text>
      </Popover>
    </PopoverContainer>
  );
};

export default NotesPopover;
