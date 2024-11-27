import React, { useState, useEffect } from 'react';
import { Actions, ITask } from '@twilio/flex-ui';
import { Flex } from '@twilio-paste/core/flex';
import { Tabs, TabList, Tab, TabPanels, TabPanel, useTabState } from '@twilio-paste/core/tabs';

export interface Props {
  thisTask?: ITask; // task assigned to component
  task?: ITask; // task in Context
}

interface LoadCRMContainerTabsPayload {
  task?: ITask;
  components: CRMComponent[];
}

interface SelectCRMContainerTabPayload {
  title: string;
}

interface CRMComponent {
  title: string;
  component: React.ComponentType;
  order?: number;
}

export const TabbedCRMTask = ({ thisTask, task }: Props) => {
  const [customComponents, setCustomComponents] = useState<CRMComponent[] | null>(null);

  const tabState = useTabState({ baseId: 'enhanced-crm-tabs' });

  // This allows short-lived tasks (e.g. callback tasks) to share/show
  // the same components as their parent task so CRM work can continue after
  // the short-lived task completes and disappears. This is done by rendering
  // components for every task, keeping the components alive, and toggling visibility.
  const display =
    task?.taskSid === thisTask?.taskSid || (thisTask && task?.attributes?.parentTask === thisTask?.sid)
      ? 'flex'
      : ('none' as any);

  const handleCustomComponent = (payload: LoadCRMContainerTabsPayload) => {
    // The action can be invoked multiple times at once. Ensure we handle the correct invocation.
    if (payload.task?.taskSid !== thisTask?.taskSid) {
      return;
    }

    if (payload.components) {
      setCustomComponents(payload.components.sort((a, b) => (a.order ?? 999) - (b.order ?? 999)));
    }
  };

  const handleSelectTab = (payload: SelectCRMContainerTabPayload) => {
    if (!payload.title) {
      return;
    }

    tabState.select(`crm-tab-${payload.title}`);
  };

  useEffect(() => {
    Actions.addListener('afterLoadCRMContainerTabs', handleCustomComponent);
    Actions.addListener('afterSelectCRMContainerTab', handleSelectTab);
    Actions.invokeAction('LoadCRMContainerTabs', {
      task: thisTask,
      components: [],
    });

    return () => {
      // Remove the listeners when we unmount
      Actions.removeListener('afterLoadCRMContainerTabs', handleCustomComponent);
      Actions.removeListener('afterSelectCRMContainerTab', handleSelectTab);
    };
  }, []);

  return (
    <div style={{ display, flex: '1 0 auto' }}>
      <Tabs state={tabState} element="CRM_TABS">
        <TabList aria-label="CRM tabs" element="CRM_TAB_LIST">
          {customComponents &&
            customComponents.map((component) => <Tab key={`crm-tab-${component.title}`}>{component.title}</Tab>)}
        </TabList>
        <TabPanels element="CRM_TAB_PANELS">
          {customComponents &&
            customComponents.map((component) => (
              <TabPanel element="CRM_TAB_PANEL" key={`crm-tab-panel-${component.title}`}>
                <Flex grow element="CRM_FLEX">
                  {component.component}
                </Flex>
              </TabPanel>
            ))}
        </TabPanels>
      </Tabs>
    </div>
  );
};
