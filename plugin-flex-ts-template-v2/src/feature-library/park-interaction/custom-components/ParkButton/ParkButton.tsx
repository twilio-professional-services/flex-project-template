import React, { useState } from 'react';
import { Actions, IconButton, ITask, styled, templates } from '@twilio/flex-ui';

import { ConversationsHelper } from '../../../../utils/helpers';
import { StringTemplates } from '../../flex-hooks/strings';

const IconContainer = styled.div`
  margin: auto;
  padding-right: 0.8em;
`;
interface TransferButtonProps {
  task: ITask;
}

const ParkButton = (props: TransferButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const allowPark = !ConversationsHelper.allowLeave(props.task);

  const parkInteraction = async () => {
    setIsLoading(true);
    await Actions.invokeAction('ParkInteraction', { task: props.task });
    setIsLoading(false);
  };

  return (
    <IconContainer>
      <IconButton
        icon="Hold"
        key="park-interaction-button"
        disabled={isLoading || !allowPark}
        onClick={parkInteraction}
        variant="secondary"
        title={
          allowPark
            ? templates[StringTemplates.ParkInteraction]()
            : templates[StringTemplates.MultipleParticipantsError]()
        }
      />
    </IconContainer>
  );
};

export default ParkButton;
