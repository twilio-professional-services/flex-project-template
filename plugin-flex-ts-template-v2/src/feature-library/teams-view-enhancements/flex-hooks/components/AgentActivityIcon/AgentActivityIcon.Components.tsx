import { styled } from '@twilio/flex-ui';

export interface ThemeOnlyProps {
  theme?: any;
  bgColor?: string;
}

export const AgentActivity = styled('div')<ThemeOnlyProps>`
  color: #ffffff;
  background-color: ${(props) => props.bgColor || props.theme.tokens.backgroundColors.colorBackgroundBody};
  display: flex;
  flex: 1 1 auto;
  flex-direction: row;
  justify-content: center;
  border-width: 0px;
  border-radius: 22px;
  height: 44px;
  width: 44px;
  align-items: center;
`;

export const Heading = styled('div')`
  font-size: 12px;
  font-weight: bold;
`;
