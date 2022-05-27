import * as Flex from '@twilio/flex-ui';
import React from 'react';
import MenuItem from "@material-ui/core/MenuItem";
import { StyledSelect, Caption } from './OutboundCallerIDSelectorStyles';
import { ContainerProps } from './OutboundCallerIDSelectorContainer'

export interface OwnProps {

}

export type Props = ContainerProps & OwnProps;

export default class OutboundCallerIDSelectorComponent extends React.Component<Props> {

  async componentDidMount() {
    await this.props.getPhoneNumbers()
  }

  render() {

    let disableHint;
    if (this.props.isFetchingPhoneNumbers)
      disableHint = <MenuItem key="placeholder" value="placeholder" disabled>
        Loading Phone Numbers...
      </MenuItem>
    else if (this.props.fetchingPhoneNumbersFailed)
      disableHint = <MenuItem key="placeholder" value="placeholder" disabled>
        Unable to load Phone Numbers
      </MenuItem>
    else
      disableHint = <MenuItem key="placeholder" value="placeholder" disabled>
        Select Caller ID
      </MenuItem>


    return (
      <div>
        <Caption
          key="callerid-select-caption"
          className="Twilio-OutboundDialerPanel-QueueSelect-Caption"
        >
          Caller Id
        </Caption>
        <StyledSelect
          value={this.props.selectedCallerId}
          onChange={(e) => this.props.setCallerId(e.target.value)}
        >
          {disableHint}
          {this.props.phoneNumbers.map((element) => (
            <MenuItem key={element.phoneNumber} value={element.phoneNumber}>
              {element.friendlyName}
            </MenuItem>
          ))}
        </StyledSelect>
      </div>
    );
  }
}
