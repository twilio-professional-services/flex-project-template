import { useEffect, useState } from 'react';
import { Template, templates } from '@twilio/flex-ui';
import { Button } from '@twilio-paste/core/button';
import { Input } from '@twilio-paste/core/input';
import { Switch } from '@twilio-paste/core/switch';
import { useUIDSeed } from '@twilio-paste/core/uid-library';
import { Modal, ModalBody, ModalFooter, ModalFooterActions, ModalHeader, ModalHeading } from '@twilio-paste/core/modal';
import { Label } from '@twilio-paste/core/label';
import { Form, FormControl } from '@twilio-paste/core/form';
import { TextArea } from '@twilio-paste/core/textarea';

import { StringTemplates } from '../../flex-hooks/strings';
import { Contact } from '../../types';
import ContactsUtil from '../../utils/ContactsUtil';

interface Props {
  contact: Contact | null;
  isOpen: boolean;
  shared: boolean;
  handleClose: () => void;
}

const ContactEditModal = ({ contact, isOpen, shared, handleClose }: Props) => {
  const [name, setName] = useState(contact?.name ?? '');
  const [phoneNumber, setPhoneNumber] = useState(contact?.phoneNumber ?? '');
  const [notes, setNotes] = useState(contact?.notes ?? '');
  const [allowColdTransfer, setAllowColdTransfer] = useState(contact?.allowColdTransfer ?? true);
  const [allowWarmTransfer, setAllowWarmTransfer] = useState(contact?.allowWarmTransfer ?? true);
  const [isSaving, setIsSaving] = useState(false);

  const seed = useUIDSeed();
  const isNew = !Boolean(contact);

  useEffect(() => {
    if (!isOpen) {
      setName('');
      setPhoneNumber('');
      setNotes('');
      setAllowColdTransfer(true);
      setAllowWarmTransfer(true);
    }
  }, [isOpen]);

  useEffect(() => {
    setName(contact?.name ?? '');
    setPhoneNumber(contact?.phoneNumber ?? '');
    setNotes(contact?.notes ?? '');
    setAllowColdTransfer(contact?.allowColdTransfer ?? true);
    setAllowWarmTransfer(contact?.allowWarmTransfer ?? true);
  }, [contact]);

  const save = async () => {
    setIsSaving(true);
    if (isNew) {
      await ContactsUtil.addContact(name, phoneNumber, notes, shared, allowColdTransfer, allowWarmTransfer);
    } else if (contact) {
      const newContact = {
        ...contact,
        name,
        phoneNumber,
        notes,
      };
      if (shared) {
        newContact.allowColdTransfer = allowColdTransfer;
        newContact.allowWarmTransfer = allowWarmTransfer;
      }
      await ContactsUtil.updateContact(newContact, shared);
    }
    handleClose();
    setIsSaving(false);
  };

  return (
    <Modal ariaLabelledby={seed('modal-heading')} isOpen={isOpen} onDismiss={handleClose} size="default">
      <ModalHeader>
        <ModalHeading as="h3" id={seed('modal-heading')}>
          <Template source={templates[isNew ? StringTemplates.ContactAdd : StringTemplates.ContactEdit]} />
        </ModalHeading>
      </ModalHeader>
      <ModalBody>
        <Form>
          <FormControl>
            <Label htmlFor={seed('name')} required>
              <Template source={templates[StringTemplates.ContactName]} />
            </Label>
            <Input
              type="text"
              id={seed('name')}
              name="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </FormControl>
          <FormControl>
            <Label htmlFor={seed('phone-number')} required>
              <Template source={templates[StringTemplates.ContactPhoneNumber]} />
            </Label>
            <Input
              type="tel"
              id={seed('phone-number')}
              name="phone-number"
              required
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </FormControl>
          <FormControl>
            <Label htmlFor={seed('notes')}>
              <Template source={templates[StringTemplates.ContactNotes]} />
            </Label>
            <TextArea id={seed('notes')} name="notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
          </FormControl>
          {ContactsUtil.shouldShowTransferOptions(shared) && (
            <>
              <FormControl>
                <Switch
                  checked={allowColdTransfer}
                  onChange={(e) => setAllowColdTransfer(e.target.checked)}
                  id={seed('allow-cold-transfer')}
                  name={'allow-cold-transfer'}
                >
                  <Template source={templates[StringTemplates.AllowColdTransfer]} />
                </Switch>
              </FormControl>
              <FormControl>
                <Switch
                  checked={allowWarmTransfer}
                  onChange={(e) => setAllowWarmTransfer(e.target.checked)}
                  id={seed('allow-warm-transfer')}
                  name={'allow-warm-transfer'}
                >
                  <Template source={templates[StringTemplates.AllowWarmTransfer]} />
                </Switch>
              </FormControl>
            </>
          )}
        </Form>
      </ModalBody>
      <ModalFooter>
        <ModalFooterActions>
          <Button variant="secondary" onClick={handleClose}>
            <Template source={templates.Cancel} />
          </Button>
          <Button variant="primary" onClick={save} disabled={!name || !phoneNumber} loading={isSaving}>
            <Template source={templates.Save} />
          </Button>
        </ModalFooterActions>
      </ModalFooter>
    </Modal>
  );
};

export default ContactEditModal;
