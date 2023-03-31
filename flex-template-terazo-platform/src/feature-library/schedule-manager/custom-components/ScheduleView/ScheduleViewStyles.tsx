import { styled } from '@twilio/flex-ui';

export const ScheduleViewWrapper = styled('div')`
  display: flex;
  height: 100%;
  overflow-y: scroll;
  flex-flow: column;
  flex-grow: 1;
  flex-shrink: 1;
`;

export const ScheduleViewHeader = styled('div')`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5em 0.5em 0 1.3em;
`;

export const PublishModalContent = styled('div')`
  display: flex;
  justify-content: center;
  padding-top: 3em;
`;
