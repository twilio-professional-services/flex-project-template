import React, { useEffect, useState } from 'react';
import {
  Actions,
  IconButton,
  TaskHelper,
  styled,
  ConferenceParticipant,
  ITask,
  useFlexSelector,
  templates,
} from '@twilio/flex-ui';

import AppState from '../../../../types/manager/AppState';
import { StringTemplates } from '../../flex-hooks/strings/Conference';

interface ThemeOnlyProps {
  theme?: any;
}

const ActionsContainer = styled('div')<ThemeOnlyProps>`
  margin-top: ${(props) => props.theme.tokens.spacings.space40};
  button {
    margin-left: ${(props) => props.theme.tokens.spacings.space20};
    margin-right: ${(props) => props.theme.tokens.spacings.space20};
  }
`;

const ActionsContainerListItem = styled('div')<ThemeOnlyProps>`
  display: flex;
  flex-grow: 0;
  button {
    margin-left: ${(props) => props.theme.tokens.spacings.space30};
    margin-right: ${(props) => props.theme.tokens.spacings.space30};
  }
`;

export interface OwnProps {
  listMode?: boolean;
  participant?: ConferenceParticipant;
  task?: ITask;
}

const ParticipantActionsButtons = (props: OwnProps) => {
  const view = useFlexSelector((state: AppState) => state.flex.view);
  const componentViewState = useFlexSelector(
    (state: AppState) => state.flex.view.componentViewStates.customParticipants,
  );

  const [isKickConfirmationVisible, setIsKickConfirmationVisible] = useState(false);

  useEffect(() => {
    return () => {
      const { participant } = props;
      if (participant && participant.status === 'recently_left') {
        let newViewState: { [index: string]: any } = {};

        if (componentViewState) {
          newViewState = {
            ...componentViewState,
          };
        }

        if (participant.callSid && newViewState[participant.callSid]) {
          delete newViewState[participant.callSid];
        }

        Actions.invokeAction('SetComponentState', {
          name: 'customParticipants',
          state: newViewState,
        });
      }
    };
  }, []);

  useEffect(() => {
    const { participant } = props;
    if (!participant || !participant.callSid) return;

    let newViewState: { [index: string]: any } = {};

    if (componentViewState) {
      newViewState = {
        ...componentViewState,
      };
    }

    newViewState[participant.callSid] = {
      showKickConfirmation: isKickConfirmationVisible,
    };

    Actions.invokeAction('SetComponentState', {
      name: 'customParticipants',
      state: newViewState,
    });
  }, [isKickConfirmationVisible]);

  const showKickConfirmation = () => setIsKickConfirmationVisible(true);

  const hideKickConfirmation = () => setIsKickConfirmationVisible(false);

  const onHoldParticipantClick = () => {
    const { participant, task } = props;

    if (!participant) return;

    const { callSid, workerSid } = participant;
    const { participantType } = participant;

    Actions.invokeAction(participant.onHold ? 'UnholdParticipant' : 'HoldParticipant', {
      participantType,
      task,
      targetSid: participantType === 'worker' ? workerSid : callSid,
    });
  };

  const onKickParticipantConfirmClick = () => {
    const { participant, task } = props;

    if (!participant) return;

    const { callSid, workerSid } = participant;
    const { participantType } = participant;
    Actions.invokeAction('KickParticipant', {
      participantType,
      task,
      targetSid: participantType === 'worker' ? workerSid : callSid,
    });
    hideKickConfirmation();
  };

  const renderKickConfirmation = () => {
    return (
      <>
        <IconButton
          icon="Accept"
          className="ParticipantCanvas-AcceptAction"
          onClick={onKickParticipantConfirmClick}
          variant="secondary"
          title={templates.CallParticipantStatusKickConfirmation()}
        />
        <IconButton
          icon="Close"
          className="ParticipantCanvas-DeclineAction"
          onClick={hideKickConfirmation}
          variant="secondary"
          title={templates.CallParticipantStatusKickCancellation()}
        />
      </>
    );
  };

  const renderActions = () => {
    const { participant, task } = props;

    if (!participant || !task) return <></>;

    const holdParticipantTooltip = participant.onHold
      ? templates[StringTemplates.UnholdParticipant]()
      : templates[StringTemplates.HoldParticipant]();
    const kickParticipantTooltip = templates[StringTemplates.RemoveParticipant]();

    const holdIcon = 'Hold';
    const unholdIcon = 'HoldOff';

    return (
      <>
        <IconButton
          icon={participant.onHold ? `${unholdIcon}` : `${holdIcon}`}
          className="ParticipantCanvas-HoldButton"
          disabled={!TaskHelper.canHold(task) || participant.status !== 'joined'}
          onClick={onHoldParticipantClick}
          variant="secondary"
          title={holdParticipantTooltip}
        />
        <IconButton
          icon="Hangup"
          className="ParticipantCanvas-HangupButton"
          onClick={showKickConfirmation}
          variant="destructive"
          title={kickParticipantTooltip}
        />
      </>
    );
  };

  if (view.activeView !== 'teams') {
    return props.listMode === true ? (
      <ActionsContainerListItem className="ParticipantCanvas-Actions">
        {isKickConfirmationVisible ? renderKickConfirmation() : renderActions()}
      </ActionsContainerListItem>
    ) : (
      <ActionsContainer className="ParticipantCanvas-Actions">
        {isKickConfirmationVisible ? renderKickConfirmation() : renderActions()}
      </ActionsContainer>
    );
  }
  return null;
};

export default ParticipantActionsButtons;
