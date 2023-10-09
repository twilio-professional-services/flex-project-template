import { IWorker, Template, templates } from '@twilio/flex-ui';
import { useTabState, Box, Heading, Tab, Tabs, TabList, TabPanel, TabPanels } from '@twilio-paste/core';

import CapacityContainer from '../../../supervisor-capacity/custom-components/CapacityContainer';
import WorkerAttributes from '../../../attribute-viewer/custom-components/WorkerAttributes';
import { isSupervisorCapacityEnabled, isAttributeViewerEnabled } from '../../config';

interface Props {
  worker?: IWorker;
}

const WorkerCanvasTabs = ({ worker }: Props) => {
  const { ...tabState } = useTabState();

  return (
    <Box overflow="auto" padding="space40" width="100%">
      <Tabs baseId="options" orientation="horizontal" state={tabState}>
        <TabList aria-label="horizontal tabs">
          {isSupervisorCapacityEnabled() && <Tab> Capacity</Tab>}
          {isAttributeViewerEnabled() && <Tab> Attributes </Tab>}
          <Tab> Team Name </Tab>
        </TabList>
        <TabPanels>
          {isSupervisorCapacityEnabled() && (
            <TabPanel>
              <CapacityContainer key="worker-capacity-container" worker={worker} />
            </TabPanel>
          )}
          {isAttributeViewerEnabled() && (
            <TabPanel>
              <WorkerAttributes key="worker-attributes" worker={worker} />
            </TabPanel>
          )}
          <TabPanel>
            <Heading as="h3" variant="heading30">
              Update Team Name
            </Heading>
            Coming soon!
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default WorkerCanvasTabs;
