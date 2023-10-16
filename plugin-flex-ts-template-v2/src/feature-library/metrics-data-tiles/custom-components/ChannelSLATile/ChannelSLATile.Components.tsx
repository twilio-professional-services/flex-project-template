import { styled } from '@twilio/flex-ui';

export interface OwnProps {
  theme?: any;
  value: number;
  count: number;
  greenLine?: number;
  yellowLine?: number;
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

function getColor(props: OwnProps) {
  const { value = 0, count } = props;
  let { greenLine, yellowLine } = props;
  if (!count) return '#f4f4f6';
  if (!greenLine) greenLine = 90;
  if (!yellowLine) yellowLine = 60;
  if (value >= greenLine) {
    return '#d0f4d1';
  } else if (value > yellowLine) {
    return '#ffe3b9';
  }
  return '#feced3';
}
