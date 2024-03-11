import { Template, templates } from '@twilio/flex-ui';
import { Flex } from '@twilio-paste/core/flex';
import { Tr, Td } from '@twilio-paste/core/table';
import { NotesIcon } from '@twilio-paste/icons/esm/NotesIcon';
import { PopoverContainer, PopoverButton, Popover } from '@twilio-paste/core/popover';
import { Menu, MenuButton, MenuItem, useMenuState } from '@twilio-paste/core/menu';
import { MediaObject, MediaFigure, MediaBody } from '@twilio-paste/core/media-object';
import { Text } from '@twilio-paste/core/text';
import { Heading } from '@twilio-paste/core/heading';
import { MoreIcon } from '@twilio-paste/icons/esm/MoreIcon';
import { DeleteIcon } from '@twilio-paste/icons/esm/DeleteIcon';
import { EditIcon } from '@twilio-paste/icons/esm/EditIcon';

import { StringTemplates } from '../../flex-hooks/strings';
import { Contact } from '../../types';
import OutboundCallModal from '../OutboundCallModal';

export interface OwnProps {
  contact: Contact;
  allowEdits: boolean;
  deleteContact: (contact: Contact) => void;
  editContact: (contact: Contact) => void;
}

const ContactRecord = ({ contact, allowEdits, deleteContact, editContact }: OwnProps) => {
  const { key, phoneNumber, name, notes } = contact;
  const menu = useMenuState();

  return (
    <Tr key={key}>
      <Td>{name}</Td>
      <Td>{phoneNumber}</Td>
      <Td textAlign="right">
        <Flex vAlignContent="center" hAlignContent="right">
          {notes && (
            <PopoverContainer baseId="notes">
              <PopoverButton variant="primary_icon" disabled={!notes}>
                <NotesIcon decorative={false} title={templates[StringTemplates.ContactNotes]()} />
              </PopoverButton>
              <Popover aria-label="Popover">
                <Heading as="h3" variant="heading30">
                  <Template source={templates[StringTemplates.ContactNotes]} />
                </Heading>
                <Text as="p">{notes}</Text>
              </Popover>
            </PopoverContainer>
          )}
          <OutboundCallModal phoneNumber={phoneNumber || ''} />
          {allowEdits && (
            <>
              <MenuButton {...menu} variant="primary_icon">
                <MoreIcon decorative={false} title={templates.MoreOptionsAriaLabel()} />
              </MenuButton>
              <Menu {...menu} aria-label={templates.MoreOptionsAriaLabel()}>
                <MenuItem {...menu} onClick={() => editContact(contact)}>
                  <MediaObject verticalAlign="center">
                    <MediaFigure spacing="space20">
                      <EditIcon decorative={true} />
                    </MediaFigure>
                    <MediaBody>
                      <Template source={templates[StringTemplates.ContactEdit]} />
                    </MediaBody>
                  </MediaObject>
                </MenuItem>
                <MenuItem {...menu} variant="destructive" onClick={() => deleteContact(contact)}>
                  <MediaObject verticalAlign="center">
                    <MediaFigure spacing="space20">
                      <DeleteIcon decorative={true} />
                    </MediaFigure>
                    <MediaBody>
                      <Template source={templates[StringTemplates.ContactDelete]} />
                    </MediaBody>
                  </MediaObject>
                </MenuItem>
              </Menu>
            </>
          )}
        </Flex>
      </Td>
    </Tr>
  );
};

export default ContactRecord;
