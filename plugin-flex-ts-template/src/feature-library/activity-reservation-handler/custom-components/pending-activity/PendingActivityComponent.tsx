import React from 'react';

import { Activity, Container, Title } from './PendingActivityStyles';
import FlexState from '../../flex-hooks/states/FlexState'


interface IProps{ }
interface IState { pendingActivity: any; }
 
class PendingActivity extends React.PureComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      pendingActivity: null
    };
  }

  activityCheckInterval!: NodeJS.Timer;

  componentDidMount() {
    this.activityCheckInterval = setInterval(() => {
      const pendingActivity = FlexState.pendingActivity;
      
      if (pendingActivity?.sid !== this.state.pendingActivity?.sid) {
        this.setState({ pendingActivity });
      }
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.activityCheckInterval);
  }

  render() {
    return (
      this.state.pendingActivity && this.state.pendingActivity.isUserSelected ? (
        <Container>
          <Title>Pending Activity</Title>
          <Activity>{this.state.pendingActivity.name}</Activity>
        </Container>
      ) : null
    )
  }
}

export default PendingActivity;
