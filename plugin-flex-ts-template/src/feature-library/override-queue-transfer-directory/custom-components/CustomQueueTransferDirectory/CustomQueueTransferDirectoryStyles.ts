import {
  FlexBox,
  FlexBoxColumn,
} from '@twilio/flex-ui'
import styled from 'react-emotion';
import Input from '@material-ui/core/Input';

export const ItemContainer = styled(FlexBox)`
  flex-grow: 1;
  overflow-y: auto;
  border-style: solid;
  border-width: 1px 0 0 0;
  ${(props) => props.theme.WorkerDirectory.ItemsContainer}
`;

export const StyledInput = styled(Input)`
  margin-left: 12px;
  margin-top: 10px;
  width: calc(100% - 24px);
`;

export const InputContainer = styled("div")`
  flex: 0 0 56px;
`;

export const TabContainer = styled(FlexBoxColumn)`
  overflow-x: hidden;
`;
