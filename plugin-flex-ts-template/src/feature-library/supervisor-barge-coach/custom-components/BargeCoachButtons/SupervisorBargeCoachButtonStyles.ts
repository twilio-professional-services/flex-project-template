import styled from 'react-emotion';

export const ButtonContainer = styled('div')`
  display: flex;
  justify-content: center;
  margin-bottom: 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  align-items: center;
  text-align: center;
`;

export const buttonStyleActive = {
  width: '44px',
  height: '44px',
  'marginLeft': '6px',
  'marginRight': '6px',
  'color': 'limegreen',
}

export const buttonStyle = {
  width: '44px',
  height: '44px',
  'marginLeft': '6px',
  'marginRight': '6px'
}