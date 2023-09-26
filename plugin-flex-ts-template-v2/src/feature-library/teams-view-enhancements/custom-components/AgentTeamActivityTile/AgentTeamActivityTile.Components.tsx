import { styled } from '@twilio/flex-ui';

export interface OwnProps {
  theme?: any;
  bgColor?: string;
  agentCount: number;
  totalAgents: number;
  maxWidth: number;
}

export interface ThemeOnlyProps {
  theme?: any;
  bgColor?: string;
}

export const TileWrapper = styled('div')<ThemeOnlyProps>`
  max-height: 220px;
  display: flex;
  flex-direction: column;
  padding: ${({ theme }) => theme.tokens.spacings.space40};
  margin-left: ${({ theme }) => theme.tokens.spacings.space40};
  margin-right: ${({ theme }) => theme.tokens.spacings.space40};
  border-style: solid;
  border-width: ${({ theme }) => theme.tokens.borderWidths.borderWidth20};
  border-radius: ${({ theme }) => theme.tokens.radii.borderRadius20};
  border-color: ${({ theme }) => theme.tokens.borderColors.colorBorderWeaker};
  background-color: ${(props) => props.bgColor || props.theme.tokens.backgroundColors.colorBackgroundBody};
  color: ${({ theme }) => theme.tokens.textColors.colorText};
`;

export const Title = styled('p')<ThemeOnlyProps>`
  min-height: ${({ theme }) => theme.tokens.sizings.sizeSquare70};
  margin-top: ${({ theme }) => theme.tokens.spacings.space0};
  margin-bottom: ${({ theme }) => theme.tokens.spacings.space0};
  font-size: ${({ theme }) => theme.tokens.fontSizes.fontSize40};
  line-height: ${({ theme }) => theme.tokens.lineHeights.lineHeight40};
  font-weight: ${({ theme }) => theme.tokens.fontWeights.fontWeightBold};
`;

export const Content = styled('div')<ThemeOnlyProps>`
  margin-top: ${({ theme }) => theme.tokens.spacings.space50};
  font-size: ${({ theme }) => theme.tokens.fontSizes.fontSize90};
  line-height: ${({ theme }) => theme.tokens.lineHeights.lineHeight90};
  font-weight: ${({ theme }) => theme.tokens.fontWeights.fontWeightBold};
`;

export const AgentActivity = styled('div')<ThemeOnlyProps>`
  color: #ffffff;
  background-color: ${(props) => props.bgColor || props.theme.tokens.backgroundColors.colorBackgroundBody};
  display: flex;
  flex: 1 1 auto;
  flex-direction: row;
  font-size: 11px;
  justify-content: center;
  border-width: 0px;
  border-radius: 12px;
  height: 24px;
  min-width: 24px;
  align-items: center;
`;

export const Label = styled('div')<ThemeOnlyProps>`
  font-size: 12px;
`;

export const Heading = styled('div')<ThemeOnlyProps>`
  font-size: 12px;
  font-weight: bold;
`;

export const Legend = styled('div')<ThemeOnlyProps>`
  background-color: ${(props) => props.bgColor || props.theme.tokens.backgroundColors.colorBackgroundBody};
  font-size: 10px;
  font-weight: bold;
  padding: 2px;
  margin-right: 8px;
  color: #ffffff;
`;
