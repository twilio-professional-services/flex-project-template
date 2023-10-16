import { styled } from '@twilio/flex-ui';

export interface OwnProps {
  theme?: any;
  bgColor?: string;
  value: number;
  count?: number;
  greenLine?: number;
  yellowLine?: number;
}

export interface ThemeOnlyProps {
  theme?: any;
  bgColor?: string;
}

export const Channel = styled('div')`
  display: flex;
  flex: 1 1 auto;
  flex-direction: row;
  font-size: 12px;
  margin-bottom: 2px;
  margin-top: 2px;
`;

export const Label = styled('div')<ThemeOnlyProps>`
  color: #121c2d;
  background-color: ${(props) => props.bgColor || props.theme.tokens.backgroundColors.colorBackgroundBody};
  font-size: 12px;
  font-weight: bold;
  width: 55px;
  padding: 2px 2px 2px 6px;
  margin: 2px;
`;

export const Metric = styled('div')`
  color: #121c2d;
  font-size: 12px;
  padding: 2px;
  width: 40px;
  text-align: right;
  margin: 2px;
  background-color: #f4f4f6;
`;

export const SLPct = styled('div')<OwnProps>`
  color: #121c2d;
  background-color: ${(props) => getColor(props)};
  font-size: 12px;
  font-weight: bold;
  padding: 2px;
  width: 40px;
  text-align: right;
  margin: 2px;
`;

function getColor(props: OwnProps) {
  const { value } = props;
  let { greenLine, yellowLine } = props;
  if (!greenLine) greenLine = 90;
  if (!yellowLine) yellowLine = 60;
  if (value >= greenLine) {
    return '#d0f4d1';
  } else if (value > yellowLine) {
    return '#ffe3b9';
  }
  return '#feced3';
}
