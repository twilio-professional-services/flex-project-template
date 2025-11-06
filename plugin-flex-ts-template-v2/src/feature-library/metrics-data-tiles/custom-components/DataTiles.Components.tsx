import { styled } from '@twilio/flex-ui';

export interface OwnProps {
  bgColor?: string;
  mode?: string;
  theme?: any;
}

export interface ThemeOnlyProps {
  theme?: any;
}

export const TileWrapper = styled('div')<OwnProps>`
  display: flex;
  flex-direction: column;
  padding: ${({ theme }) => theme.tokens.spacings.space40};
  border-style: solid;
  border-width: ${({ theme }) => theme.tokens.borderWidths.borderWidth20};
  border-radius: ${({ theme }) => theme.tokens.radii.borderRadius20};
  border-color: ${({ theme }) => theme.tokens.borderColors.colorBorderWeaker};
  background-color: ${(props) => props.bgColor || props.theme.tokens.backgroundColors.colorBackgroundBody};
  color: ${(props) => {
    if (props.mode === 'light') return '#121c2d';
    return props.theme.tokens.textColors.colorText;
  }};
`;

export const WideTileWrapper = styled('div')<ThemeOnlyProps>`
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

export const Title = styled('p')<OwnProps>`
  min-height: ${({ theme }) => theme.tokens.sizings.sizeSquare70};
  margin-top: ${({ theme }) => theme.tokens.spacings.space0};
  margin-bottom: ${({ theme }) => theme.tokens.spacings.space0};
  font-size: ${({ theme }) => theme.tokens.fontSizes.fontSize40};
  line-height: ${({ theme }) => theme.tokens.lineHeights.lineHeight40};
  font-weight: ${({ theme }) => theme.tokens.fontWeights.fontWeightBold};
  color: ${(props) => {
    if (props.mode === 'light') return '#121c2d';
    return props.theme.tokens.textColors.colorText;
  }};
  justify-content: center;
  display: flex;
`;

export const Content = styled('div')<ThemeOnlyProps>`
  margin-top: ${({ theme }) => theme.tokens.spacings.space50};
  font-size: ${({ theme }) => theme.tokens.fontSizes.fontSize90};
  line-height: ${({ theme }) => theme.tokens.lineHeights.lineHeight90};
  font-weight: ${({ theme }) => theme.tokens.fontWeights.fontWeightBold};
  color: #121c2d;
  justify-content: center;
  display: flex;
`;

export const Channel = styled('div')`
  display: flex;
  flex-direction: row;
  vertical-align: top;
  justify-content: center;
`;

export const ChannelIcon = styled('div')`
  color: #121c2d;
  margin-top: 0px;
  margin-bottom: 0px;
  height: 24px;
`;

export const MetricsContainer = styled('div')`
  flex-direction: row;
  display: flex;
  justify-content: center;
  padding: 2px;
`;

export const MetricMiniTile = styled('div')`
  flex-direction: column;
  justify-content: center;
  border-width: 1px;
  border-radius: 6px;
  border-style: solid;
  border-color: rgba(0, 0, 0, 0.5);
  margin-left: 2px;
  margin-right: 2px;
`;

export const Label = styled('div')`
  color: #121c2d;
  font-size: 11px;
  padding: 2px 8px;
  text-align: center;
`;

export const Metric = styled('div')`
  color: #121c2d;
  font-size: 14px;
  font-weight: bold;
  padding: 2px;
  text-align: center;
`;

export const Summary = styled('div')`
  flex-direction: column;
  padding-right: 16px;
`;

export const Chart = styled('div')`
  display: flex;
  flex-direction: column;
  width: 130px;
  display: flex;
  justify-content: center;
`;

export const TeamTileWrapper = styled('div')<OwnProps>`
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

export const TmLabel = styled('div')<ThemeOnlyProps>`
  font-size: 12px;
`;

export const TmHeading = styled('div')<ThemeOnlyProps>`
  font-size: 12px;
  font-weight: bold;
`;
