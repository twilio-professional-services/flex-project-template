import React from 'react';
import { Actions } from '@twilio/flex-ui';
import * as Flex from '@twilio/flex-ui';

import { StyledButton } from './ChatTransferButtonStyles';

export interface OwnProps {
  task?: Flex.ITask;
  theme?: Flex.Theme;
}

export type Props = OwnProps;

export default class TransferButtonComponent extends React.PureComponent<Props> {

  render() {
    const { theme } = this.props;
    return (
      <StyledButton
        color={this.props.theme?.colors.base11}
        onClick={() => Actions.invokeAction('ShowDirectory')}
      >
        Transfer
      </StyledButton>
    );
  }
}