import { Template } from '@twilio/flex-ui';
import { Flex } from '@twilio-paste/core/flex';
import { Heading } from '@twilio-paste/core/heading';
import { Box } from '@twilio-paste/core/box';
import { Tabs, TabList, Tab, TabPanels, TabPanel } from '@twilio-paste/core/tabs';
import { useUID } from '@twilio-paste/core/uid-library';

import { StringTemplates } from '../../flex-hooks/strings';
import RecentTab from '../RecentTab/RecentTab';
import DirectoryTab from '../DirectoryTab/DirectoryTab';

const ContactsView = () => {
  const selectedId = useUID();

  return (
    <Flex element="CONTACTS_VIEW_WRAPPER" vertical grow shrink>
      <Heading as="h1" variant="heading30">
        <Template code={StringTemplates.Contacts} />
      </Heading>
      <Box width="100%">
        <Tabs selectedId={selectedId} baseId="contacts-tabs">
          <TabList aria-label="Contacts tabs">
            <Tab id={selectedId}>
              <Template code={StringTemplates.Recent} />
            </Tab>
            <Tab>
              <Template code={StringTemplates.MyContacts} />
            </Tab>
            <Tab>
              <Template code={StringTemplates.SharedContacts} />
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <RecentTab />
            </TabPanel>
            <TabPanel>
              <DirectoryTab shared={false} />
            </TabPanel>
            <TabPanel>
              <DirectoryTab shared={true} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Flex>
  );
};

export default ContactsView;
