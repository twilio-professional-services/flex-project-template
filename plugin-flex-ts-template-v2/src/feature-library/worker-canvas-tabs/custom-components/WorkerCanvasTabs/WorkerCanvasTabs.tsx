import { Actions, IWorker, Template, templates, WorkerSkills } from '@twilio/flex-ui';
import { useUID } from '@twilio-paste/core/uid-library';
import { useTabState, Box, Tab, Tabs, TabList, TabPanel, TabPanels } from '@twilio-paste/core';

import CapacityContainer from '../../../supervisor-capacity/custom-components/CapacityContainer';
import WorkerAttributes from '../../../attribute-viewer/custom-components/WorkerAttributes';
import UpdateWorkerContainer from '../../../update-worker-attributes/custom-components/UpdateWorkerContainer/UpdateWorkerContainer';
import { isSupervisorCapacityEnabled, isAttributeViewerEnabled, isUpdateWorkerEnabled } from '../../config';
import { StringTemplates } from '../../flex-hooks/strings';

const handleClose = () => {
  Actions.invokeAction('SelectWorkerInSupervisor', { worker: undefined });
  Actions.invokeAction('SetComponentState', { name: 'SupervisorCanvasTabs', state: { selectedTabName: undefined } });
};

interface Props {
  worker?: IWorker;
}

const WorkerCanvasTabs = ({ worker }: Props) => {
  const randomId = useUID();
  const { ...tabState } = useTabState();

  return (
    <Box overflow="auto" padding="space40" width="100%">
      <Tabs selectedId={randomId} baseId="options" orientation="horizontal" state={tabState}>
        <TabList aria-label="horizontal tabs">
          <Tab id={randomId} element="WORKER_CANVAS_TAB">
            <Template source={templates[StringTemplates.WorkerCanvasTabSkills]} />
          </Tab>
          {isSupervisorCapacityEnabled() && (
            <Tab element="WORKER_CANVAS_TAB">
              <Template source={templates[StringTemplates.WorkerCanvasTabCapacity]} />
            </Tab>
          )}
          {isAttributeViewerEnabled() && (
            <Tab element="WORKER_CANVAS_TAB">
              <Template source={templates[StringTemplates.WorkerCanvasTabAttributes]} />
            </Tab>
          )}
          {isUpdateWorkerEnabled() && (
            <Tab element="WORKER_CANVAS_TAB">
              <Template source={templates[StringTemplates.WorkerCanvasTabDetails]} />
            </Tab>
          )}
        </TabList>
        <TabPanels>
          <TabPanel>{worker && <WorkerSkills key="skills" worker={worker} onClose={handleClose} />}</TabPanel>
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
          {isUpdateWorkerEnabled() && (
            <TabPanel>{worker && <UpdateWorkerContainer key="update-worker" worker={worker} />}</TabPanel>
          )}
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default WorkerCanvasTabs;
