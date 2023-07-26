import { styled } from '@twilio/flex-ui';

export interface OwnProps {
  age: number;
  redLine: number;
  yellowLine: number;
}

const getTaskHighlightColor = (props: OwnProps) => {
  let color = 'white';
  const taskAge = props.age;
  if (taskAge > props.redLine) color = 'red';
  else if (taskAge > props.yellowLine) color = 'yellow';
  return color;
};

export const TaskCardBox = styled('div')<OwnProps>`
  padding-left: 5px;
  border-width: 3px;
  border-radius: 10px;
  border-style: solid;
  border-color: ${(props) => getTaskHighlightColor(props)};
`;
