import styled from 'react-emotion';

export const ButtonContainer = styled('div')`
  display: flex;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  align-items: center;
  text-align: center;
  justify-content: center;
`;

export const buttonStyleActive = {
  'marginLeft': '6px',
  'marginRight': '6px',
  'color': 'forestgreen',
}

export const buttonStyle = {
  'marginLeft': '6px',
  'marginRight': '6px'
}