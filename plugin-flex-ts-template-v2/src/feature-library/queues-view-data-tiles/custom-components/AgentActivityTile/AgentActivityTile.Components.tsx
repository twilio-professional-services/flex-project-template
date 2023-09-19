import { styled } from '@twilio/flex-ui';

export interface ThemeOnlyProps {
  theme?: any;
  bgColor?: string;
}

export const TileWrapper = styled('div')<ThemeOnlyProps>`
  display: flex;
  flex-direction: row;
  min-width: 300px;
  padding: ${({ theme }) => theme.tokens.spacings.space40};
  border-style: solid;
  border-width: ${({ theme }) => theme.tokens.borderWidths.borderWidth20};
  border-radius: ${({ theme }) => theme.tokens.radii.borderRadius20};
  border-color: ${({ theme }) => theme.tokens.borderColors.colorBorderWeaker};
  background-color: ${({ theme }) => theme.tokens.backgroundColors.colorBackgroundBody};
  color: ${({ theme }) => theme.tokens.textColors.colorText};
`;

export const Title = styled('p')<ThemeOnlyProps>`
  min-height: ${({ theme }) => theme.tokens.sizings.sizeSquare70};
  margin-top: ${({ theme }) => theme.tokens.spacings.space0};
  margin-bottom: ${({ theme }) => theme.tokens.spacings.space0};
  font-size: ${({ theme }) => theme.tokens.fontSizes.fontSize30};
  line-height: ${({ theme }) => theme.tokens.lineHeights.lineHeight40};
  font-weight: ${({ theme }) => theme.tokens.fontWeights.fontWeightBold};
  justify-content: center;
  display: flex;
  margin-bottom: 4px;
`;

export const Content = styled('div')<ThemeOnlyProps>`
  margin-top: ${({ theme }) => theme.tokens.spacings.space50};
  font-size: ${({ theme }) => theme.tokens.fontSizes.fontSize90};
  line-height: ${({ theme }) => theme.tokens.lineHeights.lineHeight90};
  font-weight: ${({ theme }) => theme.tokens.fontWeights.fontWeightBold};
`;

export const Summary = styled('div')`
  flex-direction: column;
  padding-right: 16px;
  max-width: 150px;
`;

export const Chart = styled('div')`
  display: flex;
  flex-direction: column;
  width: 130px;
  display: flex;
  justify-content: center;
`;

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
