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

const ActionsContainer = styled('div')`
  margin-top: 0.75rem;
  button {
    margin-left: 0.25rem;
    margin-right: 0.25rem;
  }
`;

const ActionsContainerListItem = styled('div')`
  display: flex;
  -moz-box-flex: 0;
  flex-grow: 0;
  button {
    margin-left: 0.5rem;
    margin-right: 0.5rem;
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
        />
        <IconButton
          icon="Close"
          className="ParticipantCanvas-DeclineAction"
          onClick={hideKickConfirmation}
          variant="secondary"
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
