import { styled } from '@twilio/flex-ui';

export const AdminViewWrapper = styled('div')`
  display: flex;
  height: 100%;
  overflow-y: scroll;
  flex-flow: column;
  flex-grow: 1;
  flex-shrink: 1;
`;

export const FeatureCardWrapper = styled('div')`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(430px, 1fr));
`;
