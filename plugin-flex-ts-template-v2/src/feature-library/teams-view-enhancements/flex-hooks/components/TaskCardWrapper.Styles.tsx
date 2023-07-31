import { styled } from '@twilio/flex-ui';

export interface OwnProps {
  age: number;
  redLine: number;
  yellowLine: number;
}

const getTaskHighlightColor = (props: OwnProps) => {
  let color = 'transparent';
  const taskAge = props.age;
  if (taskAge > props.redLine) color = 'red';
  else if (taskAge > props.yellowLine) color = 'yellow';
  return color;
};

export const TaskCardBox = styled('div')<OwnProps>`
  border-width: 3px;
  border-radius: 6px;
  border-style: solid;
  border-color: ${(props) => getTaskHighlightColor(props)};
  overflow: hidden;
`;

export const TaskCardInnerBox = styled('div')`
  margin: -8px -16px -8px 0;
`;
