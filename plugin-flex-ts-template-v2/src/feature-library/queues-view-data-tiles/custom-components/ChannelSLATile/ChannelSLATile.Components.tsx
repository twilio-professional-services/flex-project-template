import { styled } from '@twilio/flex-ui';

export interface OwnProps {
  theme?: any;
  value: number;
  count: number;
  greenLine?: number;
  yellowLine?: number;
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
  background-color: ${(props) => getColor(props)};
  color: ${({ theme }) => theme.tokens.textColors.colorText};
`;

export const Title = styled('p')<ThemeOnlyProps>`
  min-height: ${({ theme }) => theme.tokens.sizings.sizeSquare70};
  margin-top: ${({ theme }) => theme.tokens.spacings.space0};
  margin-bottom: ${({ theme }) => theme.tokens.spacings.space0};
  font-size: ${({ theme }) => theme.tokens.fontSizes.fontSize40};
  line-height: ${({ theme }) => theme.tokens.lineHeights.lineHeight40};
  font-weight: ${({ theme }) => theme.tokens.fontWeights.fontWeightBold};
  color: #121c2d;
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

export const Description = styled('div')<ThemeOnlyProps>`
  font-size: ${({ theme }) => theme.tokens.fontSizes.fontSize20};
  line-height: ${({ theme }) => theme.tokens.lineHeights.lineHeight10};
`;

export const TileWrapper1 = styled('div')<OwnProps>`
  background-color: ${(props) => getColor(props)};
  color: ${(props) => props.theme.calculated.textColor};
  padding: 12px;
  box-shadow: ${(props) => props.theme.colors.base4} 0 -1px 0 inset;
  display: flex;
  flex-direction: column;
`;

export const Channel = styled('div')`
  display: flex;
  flex-direction: row;
  height: 30px;
  vertical-align: top;
  justify-content: center;
`;

export const ChannelIcon = styled('div')`
  color: #121c2d;
  margin-top: 0px;
  margin-bottom: 0px;
  height: 24px;
`;
export const Handled = styled('div')`
  display: flex;
  flex-direction: row;
  height: 25px;
`;

export const Label = styled('div')`
  color: #121c2d;
  font-size: 12px;
  font-weight: bold;
  width: 100px;
  padding: 2px;
`;

export const Metric = styled('div')`
  color: #121c2d;
  font-size: 12px;
  font-weight: bold;
  width: 50px;
  padding: 2px;
  text-align: right;
`;

function getColor(props: OwnProps) {
  const { value = 0, count, theme } = props;
  let { greenLine, yellowLine } = props;
  // No color if handled tasks count = 0 (N/A)
  if (!count) return theme.tokens.backgroundColors.colorBackgroundBody;
  if (!greenLine) greenLine = 90;
  if (!yellowLine) yellowLine = 60;
  if (value >= greenLine) {
    return '#d0f4d1';
  } else if (value > yellowLine) {
    return '#ffe3b9';
  }
  return '#feced3';
}
