import * as Flex from '@twilio/flex-ui';
import { Manager } from '@twilio/flex-ui';
import { v4 as uuidv4 } from 'uuid';

import {
  addHistoricalContact,
  initRecents,
  clearRecents,
  addDirectoryContact,
  updateDirectoryContact,
  removeDirectoryContact,
  initDirectory,
} from '../flex-hooks/state';
import { Contact, HistoricalContact } from '../types';
import { getRecentDaysToKeep, isRecentsEnabled, isPersonalDirectoryEnabled, isSharedDirectoryEnabled } from '../config';
import { getUserLanguage } from '../../../utils/configuration';
import SyncClient, { getAllSyncMapItems } from '../../../utils/sdk-clients/sync/SyncClient';
import logger from '../../../utils/logger';

const manager = Manager.getInstance();
const accountSid = manager.serviceConfiguration.account_sid;
const ContactHistoryKey = 'Contacts_Recent';
const ContactKey = 'Contacts';

class ContactsUtil {
  isRecentsInitialized = false;

  initRecents = async () => {
    if (this.isRecentsInitialized) {
      return;
    }
    const workerSid = manager.workerClient?.workerSid;
    if (!workerSid) {
      logger.error('[contacts] Error loading recent contacts: No worker sid');
      return;
    }
    try {
      const map = await SyncClient.map(`${ContactHistoryKey}_${workerSid}`);
      const mapItems = await getAllSyncMapItems(map);

      // Subscribe to events which trigger Redux updates
      map.on('itemAdded', (args) => {
        manager.store.dispatch(addHistoricalContact(args.item.data));
      });
      map.on('itemRemoved', (args) => {
        console.log(`Map item ${args.key} was removed`);
      });
      map.on('itemUpdated', (args) => {
        console.log(`Map item ${args.item.key} was updated`);
      });
      map.on('removed', () => {
        manager.store.dispatch(clearRecents());
        this.isRecentsInitialized = false;
      });

      // Sort the recents so that most recent is first
      const contactList = mapItems
        .map((mapItem) => mapItem.data as HistoricalContact)
        .sort((a, b) => (new Date(a.dateTime) < new Date(b.dateTime) ? 1 : -1));
      if (contactList && contactList.length > 0) {
        manager.store.dispatch(initRecents(contactList));
      }
      this.isRecentsInitialized = true;
    } catch (error: any) {
      logger.error('[contacts] Error loading recent contacts', error);
    }
  };

  initDirectory = async (shared: boolean) => {
    const workerSid = manager.workerClient?.workerSid;
    if (!workerSid) {
      logger.error('[contacts] Error loading contacts: No worker sid');
      return;
    }
    try {
      const map = await SyncClient.map(`${ContactKey}_${shared ? accountSid : workerSid}`);
      const mapItems = await getAllSyncMapItems(map);

      // Subscribe to events which trigger Redux updates
      map.on('itemAdded', (args) => {
        manager.store.dispatch(addDirectoryContact({ shared, contact: args.item.data }));
      });
      map.on('itemRemoved', (args) => {
        manager.store.dispatch(removeDirectoryContact({ shared, key: args.key }));
      });
      map.on('itemUpdated', (args) => {
        manager.store.dispatch(updateDirectoryContact({ shared, contact: args.item.data }));
      });

      const contacts = mapItems
        .map((mapItem) => mapItem.data as Contact)
        .sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1));
      if (contacts && contacts.length > 0) {
        manager.store.dispatch(initDirectory({ shared, contacts }));
      }
    } catch (error: any) {
      logger.error('[contacts] Error loading contacts', error);
    }
  };

  initContacts = async () => {
    if (isRecentsEnabled()) {
      await this.initRecents();
    }
    if (isPersonalDirectoryEnabled()) {
      await this.initDirectory(false);
    }
    if (isSharedDirectoryEnabled()) {
      await this.initDirectory(true);
    }
  };

  addHistoricalContact = async (task: Flex.ITask) => {
    const { taskChannelUniqueName: channel, sid: taskSid, queueName, age: duration } = task;
    const lang = getUserLanguage();
    const dateTime = task.dateCreated.toLocaleString(lang);
    // Enable caller name number lookup on phone number to populate name
    const {
      direction,
      from,
      outbound_to,
      call_sid,
      to,
      name,
      channelType,
      conversationSid,
      conversations,
      customerName,
      customerAddress,
      conference,
    } = task.attributes;

    const twilioAddress = conversations?.external_contact;
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
    const contact: HistoricalContact = {
      key: uuidv4(),
      from,
      name,
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
      customerName,
      customerAddress,
      twilioAddress,
    };

    // Default
    contact.name = customerName;

    if (channel === 'voice') {
      contact.channelType = channel;
    }

    if (direction === 'inbound') {
      contact.phoneNumber = from || customerAddress;
      contact.twilioPhoneNumber = to || twilioAddress;
    } else {
      contact.phoneNumber = outbound_to;
      contact.twilioPhoneNumber = from;
    }

    // add item to the sync map
    const workerSid = manager.workerClient?.workerSid;
    if (!workerSid) {
      logger.error('[contacts] Error adding to recent contacts: No worker sid');
      return;
    }
    try {
      const map = await SyncClient.map(`${ContactHistoryKey}_${workerSid}`);
      await map.set(contact.key, contact, { ttl: getRecentDaysToKeep() * 86400 });
      if (!this.isRecentsInitialized) {
        this.initRecents();
      }
    } catch (error: any) {
      logger.error('[contacts] Error adding to recent contacts', error);
    }
  };

  clearRecents = async () => {
    const workerSid = manager.workerClient?.workerSid;
    if (!workerSid) {
      logger.error('[contacts] Error adding to recent contacts: No worker sid');
      return;
    }
    try {
      const map = await SyncClient.map(`${ContactHistoryKey}_${workerSid}`);
      await map.removeMap();
    } catch (error: any) {
      logger.error('[contacts] Error clearing recent contacts', error);
    }
  };

  addContact = async (name: string, phoneNumber: string, notes: string, shared: boolean) => {
    const workerSid = manager.workerClient?.workerSid;
    if (!workerSid && !shared) {
      logger.error('[contacts] Error adding contact: No worker sid');
      return;
    }
    try {
      const contact = {
        key: uuidv4(),
        name,
        phoneNumber,
        notes,
      };
      const map = await SyncClient.map(`${ContactKey}_${shared ? accountSid : workerSid}`);
      await map.set(contact.key, contact);
    } catch (error: any) {
      logger.error('[contacts] Error adding contact', error);
    }
  };

  deleteContact = async (key: string, shared: boolean) => {
    const workerSid = manager.workerClient?.workerSid;
    if (!workerSid && !shared) {
      logger.error('[contacts] Error removing contact: No worker sid');
      return;
    }
    try {
      const map = await SyncClient.map(`${ContactKey}_${shared ? accountSid : workerSid}`);
      await map.remove(key);
    } catch (error: any) {
      logger.error('[contacts] Error removing contact', error);
    }
  };

  updateContact = async (contact: Contact, shared: boolean) => {
    const workerSid = manager.workerClient?.workerSid;
    if (!workerSid && !shared) {
      logger.error('[contacts] Error updating contact: No worker sid');
      return;
    }
    try {
      const map = await SyncClient.map(`${ContactKey}_${shared ? accountSid : workerSid}`);
      await map.set(contact.key, contact);
    } catch (error: any) {
      logger.error('[contacts] Error updating contact', error);
    }
  };
}

const contactsUtil = new ContactsUtil();

export default contactsUtil;
