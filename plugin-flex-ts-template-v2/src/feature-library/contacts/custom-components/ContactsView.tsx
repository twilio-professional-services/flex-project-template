import { Template } from '@twilio/flex-ui';
import { Flex } from '@twilio-paste/core/flex';
import { Heading } from '@twilio-paste/core/heading';
import { Box } from '@twilio-paste/core/box';
import { Tabs, TabList, Tab, TabPanels, TabPanel } from '@twilio-paste/core/tabs';
import { useUID } from '@twilio-paste/core/uid-library';

import { StringTemplates } from '../flex-hooks/strings';
import RecentTab from './RecentTab/RecentTab';
import DirectoryTab from './DirectoryTab/DirectoryTab';
import { isRecentsEnabled, isPersonalDirectoryEnabled, isSharedDirectoryEnabled, getPageSize } from '../config';
import ContactsUtil from '../utils/ContactsUtil';

const ContactsView = () => {
  const pageSize = getPageSize();
  const recentTabId = useUID();
  const personalTabId = useUID();
  const sharedTabId = useUID();
  const selectedId = isRecentsEnabled() ? recentTabId : isPersonalDirectoryEnabled() ? personalTabId : sharedTabId; // Default to Recents if enabled, else Personal Directory if enabled, else Shared Directory if enabled

  return (
    <Flex element="CONTACTS_VIEW_WRAPPER" vertical grow shrink>
      <Heading as="h1" variant="heading30">
        <Template code={StringTemplates.Contacts} />
      </Heading>
      <Box width="100%">
        <Tabs selectedId={selectedId} baseId="contacts-tabs">
          <TabList aria-label="Contacts tabs">
            {isRecentsEnabled() && (
              <Tab id={recentTabId}>
                <Template code={StringTemplates.Recent} />
              </Tab>
            )}
            {isPersonalDirectoryEnabled() && (
              <Tab id={personalTabId}>
                <Template code={StringTemplates.MyContacts} />
              </Tab>
            )}
            {isSharedDirectoryEnabled() && (
              <Tab id={sharedTabId}>
                <Template code={StringTemplates.SharedContacts} />
              </Tab>
            )}
          </TabList>
          <TabPanels>
            {isRecentsEnabled() && (
              <TabPanel>
                <RecentTab pageSize={pageSize} />
              </TabPanel>
            )}
            {isPersonalDirectoryEnabled() && (
              <TabPanel>
                <DirectoryTab shared={false} allowEdits={true} pageSize={pageSize} />
              </TabPanel>
            )}
            {isSharedDirectoryEnabled() && (
              <TabPanel>
                <DirectoryTab shared={true} allowEdits={ContactsUtil.canEditShared()} pageSize={pageSize} />
              </TabPanel>
            )}
          </TabPanels>
        </Tabs>
      </Box>
    </Flex>
  );
};

export default ContactsView;
