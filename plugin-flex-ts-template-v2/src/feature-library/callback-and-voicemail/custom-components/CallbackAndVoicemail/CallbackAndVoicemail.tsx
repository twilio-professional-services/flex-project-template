import { ITask, useFlexSelector, Manager, Template, templates } from '@twilio/flex-ui';
import React, { useEffect, useState } from 'react';
import { DateTime } from 'luxon';
import { TaskAttributes } from 'types/task-router/Task';
import { Button, Box, Heading, Text, Flex, Stack, HelpText } from '@twilio-paste/core';
import { InformationIcon } from '@twilio-paste/icons/esm/InformationIcon';
import { useDispatch, useSelector } from 'react-redux';

import { AppState } from '../../../../types/manager';
import { reduxNamespace } from '../../../../utils/state';
import { Actions, CallbackAndVoicemailState } from '../../flex-hooks/states/CallbackAndVoicemail';
import { StringTemplates } from '../../flex-hooks/strings/Callback';
import CallbackService, { FetchVoicemailResponse } from '../../utils/callback/CallbackService';

type CallbackAndVoicemailProps = {
  task: ITask;
  allowRequeue: boolean;
  maxAttempts: number;
};

export const CallbackAndVoicemail = ({ task, allowRequeue, maxAttempts }: CallbackAndVoicemailProps) => {
  const dispatch = useDispatch();

  const { isCompletingCallbackAction, isRequeueingCallbackAction } = useSelector(
    (state: AppState) => state[reduxNamespace].callbackAndVoicemail as CallbackAndVoicemailState,
  );

  const workerActivitySid = useFlexSelector((state) => state.flex.worker?.activity?.sid);
  const workerOffline = (activitySid: string) => {
    return activitySid === Manager.getInstance().serviceConfiguration.taskrouter_offline_activity_sid;
  };

  const taskStatus = task?.taskStatus;
  const { taskType, callBackData } = task?.attributes as TaskAttributes;
  const localTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  let timeReceived;

  if (callBackData?.utcDateTimeReceived) {
    timeReceived = DateTime.fromISO(callBackData?.utcDateTimeReceived);
  } else {
    timeReceived = DateTime.utc();
  }

  const formatOptions = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    timeZoneName: 'short',
  } as Intl.DateTimeFormatOptions;

  const localTimeShort = timeReceived.toLocaleString({ ...formatOptions, timeZone: localTz });
  const serverTimeShort = timeReceived.toLocaleString({
    ...formatOptions,
    timeZone: callBackData?.mainTimeZone || localTz,
  });
  const disableRetryButton =
    taskStatus !== 'assigned' || isCompletingCallbackAction[task.taskSid] || isRequeueingCallbackAction[task.taskSid];
  const disableCallCustomerButton = disableRetryButton || workerOffline(workerActivitySid);
  const thisAttempt = callBackData?.attempts ? Number(callBackData.attempts) + 1 : 1;

  const [recordingSid, setRecordingSid] = useState('');
  const [voicemail, setVoicemail] = useState(null as FetchVoicemailResponse | null);
  const [voicemailError, setVoicemailError] = useState(false);

  const fetchVoicemail = async () => {
    setVoicemail(null);
    setVoicemailError(false);
    if (callBackData?.recordingSid && !callBackData.isDeleted) {
      try {
        const voicemailResponse = await CallbackService.fetchVoicemail(callBackData.recordingSid);
        setVoicemail(voicemailResponse);
      } catch {
        setVoicemailError(true);
      }
    }
  };

  useEffect(() => {
    if (callBackData?.recordingSid && !callBackData.isDeleted && callBackData?.recordingSid !== recordingSid) {
      setRecordingSid(callBackData.recordingSid);
      fetchVoicemail();
    }
  }, [callBackData]);

  return (
    <>
      <Flex vertical>
        {taskType === 'callback' && (
          <Box element="C_AND_V_CONTENT_BOX">
            <Heading element="C_AND_V_CONTENT_HEADING" as="h4" variant="heading40">
              <Template source={templates[StringTemplates.CallbackRequestHeading]} />
            </Heading>
            <Text as="span">
              <Template source={templates[StringTemplates.CallbackRequestDescription]} />
            </Text>
          </Box>
        )}

        {taskType === 'voicemail' && (
          <Box element="C_AND_V_CONTENT_BOX">
            <Heading element="C_AND_V_CONTENT_HEADING" as="h4" variant="heading40">
              <Template source={templates[StringTemplates.VoicemailRequestHeading]} />
            </Heading>
            <Text as="span">
              <Template source={templates[StringTemplates.VoicemailRequestDescription]} />
            </Text>
          </Box>
        )}

        {callBackData?.recordingSid && !callBackData.isDeleted && (
          <Box element="C_AND_V_CONTENT_BOX">
            <Heading element="C_AND_V_CONTENT_HEADING" as="h4" variant="heading40">
              <Template source={templates[StringTemplates.VoicemailRecording]} />
            </Heading>
            {voicemail ? (
              <audio src={`data:${voicemail.type};base64,${voicemail.recording}`} controls />
            ) : voicemailError ? (
              <Stack orientation="horizontal" spacing="space30">
                <HelpText variant="error" marginTop="space0">
                  <Template source={templates[StringTemplates.VoicemailError]} />
                </HelpText>
                <Button variant="secondary" size="small" onClick={async () => fetchVoicemail()}>
                  <Template source={templates[StringTemplates.VoicemailTryAgain]} />
                </Button>
              </Stack>
            ) : (
              <Text as="span">
                <Template source={templates[StringTemplates.VoicemailLoading]} />
              </Text>
            )}
          </Box>
        )}

        {callBackData.transcriptText && !callBackData.isDeleted && (
          <Box element="C_AND_V_CONTENT_BOX">
            <Heading element="C_AND_V_CONTENT_HEADING" as="h4" variant="heading40">
              <Template source={templates[StringTemplates.VoicemailTranscript]} />
            </Heading>
            <Text as="span">{callBackData.transcriptText}</Text>
          </Box>
        )}

        <Box element="C_AND_V_CONTENT_BOX">
          <Heading element="C_AND_V_CONTENT_HEADING" as="h4" variant="heading40">
            <Template source={templates[StringTemplates.ContactPhone]} />
          </Heading>
          <Text as="span">{callBackData?.numberToCall}</Text>
        </Box>

        <Box element="C_AND_V_CONTENT_BOX">
          <Heading element="C_AND_V_CONTENT_HEADING" as="h4" variant="heading40">
            <Template source={templates[StringTemplates.CallReceptionTime]} />
          </Heading>
          <Flex vAlignContent="center">
            <Flex>
              <Box>{localTimeShort}</Box>
            </Flex>
            <Flex grow>
              <Box paddingLeft="space10">
                <InformationIcon
                  decorative={false}
                  title={templates[StringTemplates.SystemTime]({
                    systemTime: serverTimeShort,
                  })}
                />
              </Box>
            </Flex>
          </Flex>
        </Box>

        {allowRequeue && (
          <Box element="C_AND_V_CONTENT_BOX">
            <Heading element="C_AND_V_CONTENT_HEADING" as="h4" variant="heading40">
              <Template source={templates[StringTemplates.CallbackAttemptHeading]} />
            </Heading>
            <Text as="span">
              <Template
                source={templates[StringTemplates.CallbackAttempts]}
                thisAttempt={thisAttempt}
                maxAttempts={maxAttempts}
              />
            </Text>
          </Box>
        )}
      </Flex>

      <Box element="C_AND_V_BUTTON_BOX">
        <Button
          fullWidth
          disabled={disableCallCustomerButton}
          variant="primary"
          onClick={() => dispatch(Actions.callCustomer(task))}
        >
          <Template source={templates[StringTemplates.PlaceCallNow]} phoneNumber={callBackData?.numberToCall} />
        </Button>
      </Box>

      {allowRequeue && thisAttempt < maxAttempts && (
        <Box element="C_AND_V_BUTTON_BOX">
          <Button
            fullWidth
            disabled={disableRetryButton}
            variant="secondary"
            onClick={async () => dispatch(Actions.requeueCallback(task))}
          >
            <Template source={templates[StringTemplates.RetryLater]} />
          </Button>
        </Box>
      )}
    </>
  );
};
