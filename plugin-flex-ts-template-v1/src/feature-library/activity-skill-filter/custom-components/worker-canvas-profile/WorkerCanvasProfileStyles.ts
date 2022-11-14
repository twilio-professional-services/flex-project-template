import styled from 'react-emotion';
import { createStyles } from '@material-ui/core';

export const ContentWrapper = styled('div')`
  display: flex;
  margin-bottom: 32px;
`;

export const AvatarWrapper = styled('div')`
  width: 100px;
`;

export const Availability = styled('div')`
  flex-grow: 1;
`;

export const AgentName = styled('div')`
  overflow-x: hidden;
  text-overflow: ellipsis;
  font-size: 12px;
  font-weight: bold;
  margin: 14px 0;
`;

export const FormControlWrapper = styled('div')`
  margin-right: 16px;
`;

export const styles = createStyles({
  avatar: {
	width: 60,
	height: 60,
	marginLeft: 14,
	marginTop: 15,
	marginBottom: 12
  }
});
