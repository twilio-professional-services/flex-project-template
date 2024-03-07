import { templates, Template } from '@twilio/flex-ui';
import { Flex } from '@twilio-paste/core/flex';
import { Heading } from '@twilio-paste/core/heading';
import { Box } from '@twilio-paste/core/box';
import { Tabs, TabList, Tab, TabPanels, TabPanel } from '@twilio-paste/core/tabs';
import { useUID } from '@twilio-paste/core/uid-library';

import { StringTemplates } from '../../flex-hooks/strings';
import RecentTab from '../RecentTab/RecentTab';

const ContactsView = () => {
  const selectedId = useUID();

  return (
    <Flex element="CONTACTS_VIEW_WRAPPER" vertical grow shrink>
      <Heading as="h1" variant="heading30">
        Contacts
      </Heading>
      <Box width="100%">
        <Tabs selectedId={selectedId} baseId="horizontal-tabs-example">
          <TabList aria-label="Horizontal product tabs">
            <Tab id={selectedId}>Recent</Tab>
            <Tab>My Contacts</Tab>
            <Tab>Shared Contacts</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <RecentTab />
            </TabPanel>
            <TabPanel>
              <></>
            </TabPanel>
            <TabPanel>
              <></>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Flex>
  );
};

export default ContactsView;
