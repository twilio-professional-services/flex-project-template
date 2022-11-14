import styled from 'react-emotion';
import { FlexBox, getBackgroundWithHoverCSS } from '@twilio/flex-ui';

export const QueueAvatar = styled(FlexBox)`
    width: 44px;
    justify-content: center;
    ${(props) => props.theme.WorkerDirectory.QueueItem.Avatar};
`;

export const QueueTitleContainer = styled("div")`
    flex: 1 1 auto;
    overflow: hidden;
    margin-top: auto;
    margin-bottom: auto;
    margin-left: 14px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 12px;
    font-weight: bold;
`;

export const ItemInnerContainer = styled(FlexBox)`
  display: flex;
  padding-left: 0px;
  padding-right: 12px;
  color: inherit;
  outline: none;
  height: 44px;
  background: none;
  border: none;
  border-style: solid;
  border-width: 0px 0px 1px 0px;
  ${(props) => props.theme.WorkerDirectory.Item}
  &:hover {
    & .Twilio-WorkerDirectory-ButtonContainer {
      display: flex;
    }
    ${(props) =>
    getBackgroundWithHoverCSS(
      props.theme.WorkerDirectory.Item.background,
      props.theme.WorkerDirectory.Item.lightHover,
      true
    )}
    & .Twilio-WorkerDirectory-QueueAvatar {
      ${(props) =>
    getBackgroundWithHoverCSS(
      props.theme.WorkerDirectory.QueueItem.Avatar.background,
      props.theme.WorkerDirectory.Item.lightHover,
      true
    )}
    }
  }
`;

export const ButtonContainer = styled("div")`
  display: none;
`;
