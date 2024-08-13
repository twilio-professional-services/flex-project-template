import React, { useEffect } from 'react';
import { useFlexSelector, Template, templates, ITask } from '@twilio/flex-ui';
import { useDispatch, useSelector } from 'react-redux';
import { Flex } from '@twilio-paste/core/flex';
import { Stack } from '@twilio-paste/core/stack';
import { Box } from '@twilio-paste/core/box';
import { Text } from '@twilio-paste/core/text';

import { AppState } from '../../../../types/manager';
import { reduxNamespace } from '../../../../utils/state';
import { setBargeCoachStatus, SupervisorBargeCoachState } from '../../flex-hooks/states/SupervisorBargeCoachSlice';
import { StringTemplates } from '../../flex-hooks/strings/BargeCoachAssist';
// Used for Sync Docs
import { SyncDoc } from '../../utils/sync/Sync';

type SupervisorMonitorPanelProps = {
  icon: string;
  uniqueName: string;
  task?: ITask;
};

export const SupervisorMonitorPanel = (props: SupervisorMonitorPanelProps) => {
  const dispatch = useDispatch();

  let { supervisorArray } = useSelector(
    (state: AppState) => state[reduxNamespace].supervisorBargeCoach as SupervisorBargeCoachState,
  );
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
  const supervisorsArray = () => {
    return supervisorArray.map((supervisorArray) => (
      <li key={`${Math.random()}`}>{supervisorSwitch(supervisorArray.status, supervisorArray.supervisor)}</li>
    ));
  };

  const syncUpdates = async (): Promise<any> => {
    let doc: any = null;
    const agentWorkerSID = props?.task?.workerSid;
    if (agentWorkerSID) {
      // Let's subscribe to the sync doc as an agent/worker and check
      // if we are being coached, if we are, render that in the UI
      // otherwise leave it blank
      const mySyncDoc = `syncDoc.${agentWorkerSID}`;
      doc = await SyncDoc.getSyncDoc(mySyncDoc);
      // We are subscribing to Sync Doc updates here and logging anytime that happens
      doc.on('updated', (_updatedDoc: string) => {
        if (doc.data.supervisors) {
          supervisorArray = [...doc.data.supervisors];
        } else {
          supervisorArray = [];
        }

        // Set Supervisor's name that is coaching into props
        dispatch(
          setBargeCoachStatus({
            supervisorArray,
          }),
        );
      });
      dispatch(
        setBargeCoachStatus({
          supervisorArray: doc?.data?.supervisors || [],
        }),
      );
    }
    return doc;
  };

  useEffect(() => {
    let doc: any = null;
    (async () => {
      doc = await syncUpdates();
    })();

    return () => {
      doc?.close();
    };
  }, [selectedTaskInSupervisorSid]);

  return (
    <Flex hAlignContent="center" vertical padding="space40">
      <Stack orientation="vertical" spacing="space30" element="COACH_STATUS_PANEL_BOX">
        <Template source={templates[StringTemplates.ActiveSupervisors]} />
        <Box>
          {supervisorArray.length > 0 ? (
            <ol>
              <Text
                as="p"
                fontWeight="fontWeightMedium"
                fontSize="fontSize30"
                marginBottom="space40"
                color="colorTextSuccess"
              >
                {supervisorsArray()}
              </Text>
            </ol>
          ) : (
            <Template source={templates[StringTemplates.None]} />
          )}
        </Box>
      </Stack>
    </Flex>
  );
};
