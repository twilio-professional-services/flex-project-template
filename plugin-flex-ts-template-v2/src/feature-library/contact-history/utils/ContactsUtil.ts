import * as Flex from '@twilio/flex-ui';
import { Manager } from '@twilio/flex-ui';

import { addContact, setContactList } from '../flex-hooks/state';
import { Contact } from '../types';
import { getMaxContacts } from '../config';

const manager = Manager.getInstance();
const ContactHistoryKey = 'CONTACT_HISTORY';

class ContactsUtil {
  getRecentContactsList(): Contact[] {
    const item = localStorage.getItem(ContactHistoryKey);
    if (item) {
      return JSON.parse(item);
    }
    return [];
  }

  initContactHistory = () => {
    const contactList = this.getRecentContactsList();
    if (contactList && contactList.length > 0) {
      manager.store.dispatch(setContactList({ contactList }));
    }
  };

  setContactList = (contactList: Contact[]) => {
    localStorage.setItem(ContactHistoryKey, JSON.stringify(contactList));
  };

  addContact = (task: Flex.ITask) => {
    const { taskChannelUniqueName: channel, sid: taskSid, queueName, age: duration } = task;
    const dateTime = task.dateCreated.toLocaleString('en-US');
    // Enable caller name number lookup on phone number to populate name
    const {
      direction,
      from,
      outbound_to,
      call_sid,
      caller,
      to,
      channelType,
      conversationSid,
      conversations,
      customerName,
      conference,
    } = task.attributes;

    const outcome = conversations?.outcome || 'Completed';
    const notes = conversations?.content;
    let segmentLink;
    if (conversations?.segment_link) segmentLink = conversations?.segment_link.replace(/\\/g, '');

    let workerCallSid;
    let customerCallSid;
    if (conference && conference?.participants) {
      workerCallSid = conference?.participants.worker;
      customerCallSid = conference?.participants.customer;
    }
    const contact: Contact = {
      direction,
      channel,
      call_sid,
      dateTime,
      taskSid,
      queueName,
      duration,
      outcome,
      notes,
      segmentLink,
      channelType,
      conversationSid,
      workerCallSid,
      customerCallSid,
    };

    // Default
    contact.name = customerName || 'Customer';

    if (channel === 'voice') {
      contact.channelType = channel;
      if (caller) {
        contact.name = caller;
      }
      if (direction === 'inbound') {
        contact.phoneNumber = from;
        contact.twilioPhoneNumber = to;
      } else {
        contact.phoneNumber = outbound_to;
        contact.twilioPhoneNumber = from;
      }
    }

    // Using localStorage to persist contact list
    const contactList = this.getRecentContactsList();
    const newList = [contact].concat(contactList).slice(0, getMaxContacts());
    localStorage.setItem(ContactHistoryKey, JSON.stringify(newList));
    // Using Redux app state
    manager.store.dispatch(addContact({ contact }));
  };

  clearContactList = () => {
    localStorage.removeItem(ContactHistoryKey);
  };
}

const contactsUtil = new ContactsUtil();

export default contactsUtil;
