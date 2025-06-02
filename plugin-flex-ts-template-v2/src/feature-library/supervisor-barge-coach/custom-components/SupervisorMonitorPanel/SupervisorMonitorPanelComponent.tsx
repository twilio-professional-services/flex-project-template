import React, { useEffect, useState } from 'react';
import { useFlexSelector, Template, templates, ITask } from '@twilio/flex-ui';
import { Flex } from '@twilio-paste/core/flex';
import { Stack } from '@twilio-paste/core/stack';
import { Text } from '@twilio-paste/core/text';

import { StringTemplates } from '../../flex-hooks/strings/BargeCoachAssist';
import { SyncDoc } from '../../utils/sync/Sync';

type SupervisorMonitorPanelProps = {
  icon: string;
  uniqueName: string;
  task?: ITask;
};

export const SupervisorMonitorPanel = (props: SupervisorMonitorPanelProps) => {
  const [monitoringSupervisors, setMonitoringSupervisors] = useState([] as any[]);

  const selectedTaskInSupervisorSid = useFlexSelector((state) => state?.flex?.view?.selectedTaskInSupervisorSid);

  const supervisorSwitch = (status: string, supervisor: string) => {
    switch (status) {
      case 'barge':
        return templates[StringTemplates.PanelBarge]({ supervisor });
      case 'coaching':
        return templates[StringTemplates.PanelCoaching]({ supervisor });
      case 'monitoring':
        return templates[StringTemplates.PanelMonitoring]({ supervisor });
      default:
        return null;
    }
  };

  const filterSupervisors = (supervisor: any) =>
    supervisor.conference === props?.task?.conference?.conferenceSid ||
    supervisor.conference === props?.task?.attributes?.conference?.sid;

  const syncUpdates = async (): Promise<any> => {
    const agentWorkerSID = props?.task?.workerSid;
    if (!agentWorkerSID) {
      return null;
    }

    // Subscribe to the handling agent's Sync doc to enable real-time display of active supervisors
    const mySyncDoc = `syncDoc.${agentWorkerSID}`;
    const doc = await SyncDoc.getSyncDoc(mySyncDoc);
    doc.on('updated', (_updatedDoc: string) => {
      let supervisorArray: any[] = [];
      if (doc.data.supervisors) {
        supervisorArray = [...doc.data.supervisors];
      }
      setMonitoringSupervisors(supervisorArray.filter(filterSupervisors));
    });

    setMonitoringSupervisors(doc?.data?.supervisors?.filter(filterSupervisors) || []);
    return doc;
  };

  useEffect(() => {
    let doc: any = null;
    (async () => {
      doc = await syncUpdates();
    })();

    return () => {
      // Ensure we unsubscribe from the current doc whenever the selected task changes
      doc?.close();
    };
  }, [selectedTaskInSupervisorSid]);

  return (
    <Flex hAlignContent="center" vertical padding="space40">
      <Stack orientation="vertical" spacing="space30">
        <Template source={templates[StringTemplates.ActiveSupervisors]} />
        {monitoringSupervisors.length > 0 ? (
          monitoringSupervisors.map((supervisor: any) => (
            <Text key={`${Math.random()}`} as="p" fontWeight="fontWeightMedium" color="colorTextSuccess">
              {supervisorSwitch(supervisor.status, supervisor.supervisor)}
            </Text>
          ))
        ) : (
          <Template source={templates[StringTemplates.None]} />
        )}
      </Stack>
    </Flex>
  );
};
