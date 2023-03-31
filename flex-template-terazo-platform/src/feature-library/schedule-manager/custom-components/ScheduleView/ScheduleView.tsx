import React, { useEffect, useState } from 'react';
import { Manager, Notifications, Tab, Tabs } from '@twilio/flex-ui';
import { Button } from '@twilio-paste/core/button';
import { Heading } from '@twilio-paste/core/heading';
import { Modal, ModalBody } from '@twilio-paste/core/modal';
import { Spinner } from '@twilio-paste/core/spinner';
import { Stack } from '@twilio-paste/core/stack';
import { Text } from '@twilio-paste/core/text';
import { UploadToCloudIcon } from '@twilio-paste/icons/esm/UploadToCloudIcon';

import { PublishModalContent, ScheduleViewWrapper, ScheduleViewHeader } from './ScheduleViewStyles';
import RuleDataTable from '../RuleDataTable/RuleDataTable';
import ScheduleDataTable from '../ScheduleDataTable/ScheduleDataTable';
import { Rule, Schedule } from '../../types/schedule-manager';
import { loadScheduleData, publishSchedules } from '../../utils/schedule-manager';
import { NotificationIds } from '../../flex-hooks/notifications/ScheduleManager';
import { StringTemplates } from '../../flex-hooks/strings/ScheduleManager';

const ScheduleView = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [rules, setRules] = useState([] as Rule[]);
  const [schedules, setSchedules] = useState([] as Schedule[]);
  const [updated, setUpdated] = useState(new Date());
  const [isVersionMismatch, setIsVersionMismatch] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);
  const [publishState, setPublishState] = useState(0); // 0: normal; 1: publish in progress; 2: publish version error; 3: publish failed; 4: in available activity
  const [isDirty, setIsDirty] = useState(false);

  const ScheduleManagerStrings = Manager.getInstance().strings as any;

  useEffect(() => {
    listSchedules();

    return () => {
      if (publishState === 1) {
        Notifications.showNotification(NotificationIds.PUBLISH_ABORTED);
      }
    };
  }, []);

  const listSchedules = async () => {
    setIsLoading(true);

    const scheduleData = await loadScheduleData();

    if (scheduleData === null) {
      setLoadFailed(true);
    } else {
      setLoadFailed(false);
      setRules(scheduleData.data.rules);
      setSchedules(scheduleData.data.schedules);
      setUpdated(new Date());
      setIsVersionMismatch(scheduleData.versionIsDeployed === false);
    }

    setIsLoading(false);
  };

  const updateSchedules = (newSchedules: Schedule[]) => {
    setSchedules(newSchedules);
    setIsDirty(true);
  };

  const updateRules = (newRules: Rule[]) => {
    setRules(newRules);
    setIsDirty(true);
  };

  const publish = async () => {
    setPublishState(1);
    const publishResult = await publishSchedules();
    setPublishState(publishResult);

    if (publishResult === 0) {
      setIsDirty(false);
      await listSchedules();
    }
  };

  return (
    <ScheduleViewWrapper>
      <ScheduleViewHeader>
        <Heading as="h3" variant="heading30" marginBottom="space0">
          {ScheduleManagerStrings[StringTemplates.SCHEDULE_MANAGER_TITLE]}
        </Heading>
        <Stack orientation="horizontal" spacing="space30">
          {publishState < 2 && isVersionMismatch && (
            <Text as="span">{ScheduleManagerStrings[StringTemplates.PUBLISH_INFLIGHT]}</Text>
          )}
          <Button variant="secondary" onClick={publish} disabled={!isDirty}>
            <UploadToCloudIcon decorative />
            {ScheduleManagerStrings[StringTemplates.PUBLISH_BUTTON]}
          </Button>
        </Stack>
      </ScheduleViewHeader>
      <Tabs>
        <Tab label={ScheduleManagerStrings[StringTemplates.TAB_SCHEDULES]}>
          <ScheduleDataTable
            isLoading={isLoading}
            rules={rules}
            schedules={schedules}
            updateSchedules={updateSchedules}
            updated={updated}
          />
        </Tab>
        <Tab label={ScheduleManagerStrings[StringTemplates.TAB_RULES]}>
          <RuleDataTable isLoading={isLoading} rules={rules} schedules={schedules} updateRules={updateRules} />
        </Tab>
      </Tabs>
      <Modal
        isOpen={publishState === 1}
        onDismiss={
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          () => {}
        }
        size="default"
        ariaLabelledby=""
      >
        <ModalBody>
          <PublishModalContent>
            <Stack orientation="horizontal" spacing="space60">
              <Spinner decorative={true} size="sizeIcon100" title="Please wait..." />
              <Stack orientation="vertical" spacing="space20">
                <Heading as="h3" variant="heading30" marginBottom="space0">
                  {ScheduleManagerStrings[StringTemplates.PUBLISH_DIALOG_TITLE]}
                </Heading>
                <Text as="p">{ScheduleManagerStrings[StringTemplates.PUBLISH_DIALOG_TEXT]}</Text>
              </Stack>
            </Stack>
          </PublishModalContent>
        </ModalBody>
      </Modal>
      <Modal
        isOpen={loadFailed}
        onDismiss={
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          () => {}
        }
        size="default"
        ariaLabelledby=""
      >
        <ModalBody>
          <PublishModalContent>
            <Stack orientation="vertical" spacing="space20">
              <Heading as="h3" variant="heading30" marginBottom="space0">
                {ScheduleManagerStrings[StringTemplates.LOAD_FAILED_TITLE]}
              </Heading>
              <Text as="p">{ScheduleManagerStrings[StringTemplates.LOAD_FAILED_TEXT]}</Text>
            </Stack>
          </PublishModalContent>
        </ModalBody>
      </Modal>
    </ScheduleViewWrapper>
  );
};

export default ScheduleView;
