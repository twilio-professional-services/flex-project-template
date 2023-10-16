import { styled } from '@twilio/flex-ui';

export interface ThemeOnlyProps {
  theme?: any;
  bgColor?: string;
}

export const Channel = styled('div')<ThemeOnlyProps>`
  color: #121c2d;
  background-color: ${(props) => props.bgColor || props.theme.tokens.backgroundColors.colorBackgroundStrong};
  display: flex;
  flex-direction: row;
  justify-content: center;
  border-width: 0px;
  border-radius: 12px;
  height: 24px;
  min-width: 24px;
  align-items: center;
`;
