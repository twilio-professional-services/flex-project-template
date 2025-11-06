import { styled, Theme } from '@twilio/flex-ui';

export const SectionHeader = styled('div')`
  flex: 0 0 auto;
  font-size: 0.875rem;
  font-weight: 700;
  line-height: 1.25rem;
  margin: 1.25rem 1rem 0.5rem;
  padding: 0.5rem 0px;
  border-bottom: 1px solid ${(props) => (props.theme as Theme).tokens.borderColors.colorBorderWeak};
  color: ${(props) => (props.theme as Theme).tokens.textColors.colorText};
`;
