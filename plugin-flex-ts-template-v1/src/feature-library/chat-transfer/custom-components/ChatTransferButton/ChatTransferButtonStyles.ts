import styled from 'react-emotion';

export const StyledButton = styled('button')`
  background: ${(props) => (props.theme.background ? props.theme.background : '#ccc')};
  color: ${(props) => (props.theme.color ? props.theme.color : '#000')};
  letter-spacing: 2px;
  text-transform: uppercase;
  font-weight: bold;
  margin-right: 1em;
  padding: 0px 16px;
  height: 28px;
  font-size: 10px;
  outline: none;
  border-radius: 100px;
  align-self: center;
  border-width: initial;
  border-style: none;
  border-color: initial;
  &:hover {
    cursor: pointer;
  }
`;