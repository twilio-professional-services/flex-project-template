import { styled } from '@twilio/flex-ui';

export interface ThemeOnlyProps {
  theme?: any;
  bgColor?: string;
}

export const AgentActivity = styled('div')`
  display: flex;
  flex: 1 1 auto;
  flex-direction: row;
  font-size: 12px;
  font-size: 11px;
  margin-bottom: 1px;
  margin-top: 1px;
`;

export const Label = styled('div')<ThemeOnlyProps>`
  background-color: ${(props) => props.bgColor || props.theme.tokens.backgroundColors.colorBackgroundBody};
  font-size: 10px;
  font-weight: bold;
  width: 70px;
  padding: 2px 2px 2px 4px;
  margin: 1px;
  color: #ffffff;
`;

export const Metric = styled('div')`
  font-size: 10px;
  padding: 2px;
  min-width: 20px;
  margin: 1px;
  font-weight: bold;
`;
