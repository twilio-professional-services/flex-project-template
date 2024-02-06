import { Box } from '@twilio-paste/core/box';
import { Tabs, Tab, TabList, TabPanel, TabPanels, useTabState } from '@twilio-paste/core/tabs';
import { useUID } from '@twilio-paste/core/uid-library';
import { IWorker, Template, templates, ContentFragmentProps, WorkerSkills, Actions } from '@twilio/flex-ui';
import React from 'react';

import { StringTemplates } from '../../flex-hooks/strings';

interface Props {
  worker?: IWorker;
  fragments: React.ReactElement<
    ContentFragmentProps & {
      children?: React.ReactNode;
    },
    string | React.JSXElementConstructor<any>
  >[];
}

interface TabbedContentFragmentProps extends ContentFragmentProps {
  tabTitle: string;
}

const hasTabTitle = (
  fragment: React.ReactElement<
    ContentFragmentProps & {
      children?: React.ReactNode;
    },
    string | React.JSXElementConstructor<any>
  >,
): boolean => {
  const title = (fragment.props as TabbedContentFragmentProps)?.tabTitle;
  return !(title === '' || title === undefined || title === null);
};

const handleClose = () => {
  Actions.invokeAction('SelectWorkerInSupervisor', { worker: undefined });
  Actions.invokeAction('SetComponentState', { name: 'SupervisorCanvasTabs', state: { selectedTabName: undefined } });
};

const WorkerCanvasTabs = ({ worker, fragments }: Props) => {
  const randomId = useUID();
  const { ...tabState } = useTabState();

  return (
    <Box height="100%" borderLeftStyle="solid" borderColor="colorBorderWeak" borderWidth="borderWidth10">
      <Tabs selectedId={randomId} baseId="options" state={tabState}>
        <TabList aria-label="Worker tabs" element="WORKER_CANVAS_TAB_LIST">
          <Tab id={randomId} element="WORKER_CANVAS_TAB">
            <Template source={templates[StringTemplates.WorkerCanvasTabSkills]} />
          </Tab>
          {fragments.map((fragment) => (
            <Tab key={(fragment.props.children as React.ReactElement).key} element="WORKER_CANVAS_TAB">
              {hasTabTitle(fragment) ? (
                <Template source={templates[(fragment.props as TabbedContentFragmentProps).tabTitle]} />
              ) : (
                (fragment.props.children as React.ReactElement).key
              )}
            </Tab>
          ))}
        </TabList>
        <TabPanels>
          <TabPanel>{worker && <WorkerSkills key="skills" worker={worker} onClose={handleClose} />}</TabPanel>
          {fragments.map((fragment) => (
            <TabPanel key={(fragment.props.children as React.ReactElement).key}>
              {React.createElement((fragment.props.children as any)?.type, { worker })}
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default WorkerCanvasTabs;
